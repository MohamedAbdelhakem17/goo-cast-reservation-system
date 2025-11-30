const PackageModel = require("../../models/hourly-packages-model/hourly-packages-model.js");
const BookingModel = require("../../models/booking-model/booking-model.js");
const StudioModel = require("../../models/studio-model/studio-model.js");
const AddOnModel = require("../../models/add-on-model/add-on-model.js");
const CouponModel = require("../../models/coupon-model/coupon-model.js");
const AppError = require("../../utils/app-error.js");
const {
  HTTP_STATUS_TEXT,
  PAYMENT_METHOD,
  USER_ROLE,
} = require("../../config/system-variables.js");

const { calculateSlotPrices } = require("../../utils/priceCalculator.js");
const { getAllDay, timeToMinutes } = require("../../utils/time-mange.js");
const userProfileModel = require("../../models/user-profile-model/user-profile-model.js");
const determineUserTags = require("../../utils/tag-engine.js");

// Helper: merge overlapping intervals
function mergeIntervals(intervals) {
  if (!intervals || intervals.length === 0) return [];
  const sorted = intervals
    .map(([s, e]) => [Number(s), Number(e)])
    .filter(([s, e]) => Number.isFinite(s) && Number.isFinite(e) && e > s)
    .sort((a, b) => a[0] - b[0]);

  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length) merged.push([s, e]);
    else {
      const last = merged[merged.length - 1];
      if (s <= last[1]) last[1] = Math.max(last[1], e);
      else merged.push([s, e]);
    }
  }
  return merged;
}

// Helper: check if a slot overlaps any busy interval
function overlapsAny(start, end, merged) {
  for (const [bs, be] of merged) {
    if (bs < end && be > start) return true;
    if (bs >= end) return false;
  }
  return false;
}

/**
 * Prepare booking data for creation or update.
 * Handles user profile, studio, date/time, packages, add-ons, coupons, payment.
 *
 * @param {Object} body - request body containing booking info
 * @param {Object} user - authenticated user (optional)
 * @param {boolean} isEdit - true if editing existing booking
 * @param {boolean} partialUpdate - true if only some fields are updated
 * @returns {Object} updates object to apply to booking
 */
const prepareBookingData = async (
  body,
  user,
  isEdit = false,
  partialUpdate = false
) => {
  const updates = {};
  const {
    bookingId,
    studio: studioId,
    date,
    startSlot,
    endSlot,
    duration,
    persons,
    selectedPackage,
    selectedAddOns,
    personalInfo,
    extraComment,
    totalPrice: totalPriceFromClient,
    totalPriceAfterDiscount: totalPriceAfterDiscountFromClient,
    coupon_code,
    paymentMethod,
  } = body;

  // -------------------------------
  // 1️⃣ Handle personal info (create or update user)
  // -------------------------------
  if (personalInfo) {
    let userId;
    const userBooked = await userProfileModel.findOne({
      $or: [{ email: personalInfo.email }, { phone: personalInfo.phone }],
    });

    if (userBooked) {
      userBooked.tags = determineUserTags(userBooked);
      await userBooked.save();
      userId = userBooked._id;
    } else {
      const newUser = await userProfileModel.create({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
      });
      newUser.tags = determineUserTags(newUser);
      await newUser.save();
      userId = newUser._id;
    }

    updates.personalInfo = userId;
    if (personalInfo.comments) updates.extraComments = personalInfo.comments;
  }

  // -------------------------------
  // 2️⃣ Handle studio/date/time updates
  // -------------------------------
  // Updating a booking and checking conflicts across all studios
  if (studioId || date || startSlot || endSlot) {
    // Update studio if provided
    if (studioId) {
      const studio = await StudioModel.findById(studioId?.id || studioId);
      if (!studio)
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found");
      updates.studio = studio._id;
    }

    // Determine new date and slots
    const newDate = date || updates.date;
    const newStartSlot = startSlot || updates.startSlot;
    const newEndSlot = endSlot || updates.endSlot;

    if (newDate) updates.date = new Date(newDate);
    if (newStartSlot) updates.startSlot = newStartSlot;
    if (newEndSlot) updates.endSlot = newEndSlot;

    // Compute minutes and duration if both slots are present
    if (newStartSlot && newEndSlot) {
      const startMinutes = timeToMinutes(newStartSlot);
      const endMinutes = timeToMinutes(newEndSlot);

      updates.startSlotMinutes = startMinutes;
      updates.endSlotMinutes = endMinutes;
      updates.duration = (endMinutes - startMinutes) / 60;

      // Conflict check across all studios for the same day
      const { startOfDay, endOfDay } = getAllDay(updates.date);

      const bookings = await BookingModel.find({
        date: { $gte: startOfDay, $lt: endOfDay },
        _id: { $ne: bookingId }, // skip self if editing
      }).select("startSlotMinutes endSlotMinutes");

      const mergedBusy = mergeIntervals(
        bookings
          .map((b) => [b.startSlotMinutes, b.endSlotMinutes])
          .filter(([s, e]) => s != null && e != null && e > s)
      );

      if (overlapsAny(startMinutes, endMinutes, mergedBusy)) {
        throw new AppError(
          400,
          HTTP_STATUS_TEXT.FAIL,
          "This time is already booked in another studio"
        );
      }
    }
  }

  // -------------------------------
  // 3️⃣ Handle package/add-ons/coupons
  // -------------------------------
  if (selectedPackage || selectedAddOns || coupon_code) {
    let packagePrice = 0;
    let totalAddOnsPriceFromDb = 0;
    const addOnDetails = [];

    // Package
    if (selectedPackage) {
      const pkg = await PackageModel.findById(
        selectedPackage?.id || selectedPackage
      );
      if (!pkg)
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found");
      updates.package = pkg._id;

      // Recalculate package price if needed (e.g., slots or date changed)
      if (!partialUpdate || (partialUpdate && (date || startSlot || endSlot))) {
        const bookingDate = new Date(newDate);
        const startSlotMinutes = timeToMinutes(newStartSlot);
        const endSlotMinutes = timeToMinutes(newEndSlot);
        const slotPrices = await calculateSlotPrices({
          package: pkg,
          date: bookingDate,
          startSlotMinutes,
          endOfDay: endSlotMinutes,
          duration: updates.duration,
          bookedSlots: [],
        });
        packagePrice = slotPrices[slotPrices.length - 1].totalPrice;
        updates.totalPackagePrice = packagePrice;
      }
    }

    // Add-ons
    if (Array.isArray(selectedAddOns) && selectedAddOns.length > 0) {
      const addOnDocs = await Promise.all(
        selectedAddOns.map((a) => AddOnModel.findById(a.id))
      );
      for (let i = 0; i < selectedAddOns.length; i++) {
        const dbAddOn = addOnDocs[i];
        const clientAddOn = selectedAddOns[i];
        if (!dbAddOn) continue;
        const addOnPrice = dbAddOn.price * clientAddOn.quantity;
        totalAddOnsPriceFromDb += addOnPrice;
        addOnDetails.push({
          item: dbAddOn._id,
          quantity: clientAddOn.quantity,
          price: dbAddOn.price,
        });
      }
      updates.addOns = addOnDetails;
      updates.totalAddOnsPrice = totalAddOnsPriceFromDb;
    }

    // Total price
    updates.totalPrice = Math.round(packagePrice + totalAddOnsPriceFromDb);

    // Apply coupon if provided
    if (coupon_code) {
      const coupon = await CouponModel.findOne({ code: coupon_code });
      if (!coupon)
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Coupon not found");
      updates.totalPriceAfterDiscount = coupon.discount
        ? Math.round(
            packagePrice -
              packagePrice * (coupon.discount / 100) +
              totalAddOnsPriceFromDb
          )
        : updates.totalPrice;
    } else {
      updates.totalPriceAfterDiscount = updates.totalPrice;
    }
  }

  // -------------------------------
  // 4️⃣ Handle payment method
  // -------------------------------
  if (paymentMethod) {
    if (!Object.values(PAYMENT_METHOD).includes(paymentMethod))
      throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid payment method");
    updates.paymentMethod = paymentMethod;
  }

  return updates;
};

module.exports = prepareBookingData;
