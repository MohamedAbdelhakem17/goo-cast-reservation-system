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

const prepareBookingDataForEdit = async (body, existingBooking) => {
  if (!existingBooking) throw new AppError(400, "Booking not found");

  const updates = { ...existingBooking._doc };
  const {
    duration,
    startSlot,
    selectedPackage,
    selectedAddOns,
    coupon_code,
    date,
    assignTo,
    studio,
  } = body;

  // -------------------------------
  // Handle date update
  // -------------------------------
  if (date) {
    updates.date = date;
  }

  // -------------------------------
  // Handle assignTo update
  // -------------------------------
  if (assignTo) {
    updates.assignTo = assignTo;
  }

  // -------------------------------
  // Handle studio update
  // -------------------------------
  if (studio) {
    updates.studio = studio;
  }

  // -------------------------------
  // Handle startSlot update
  // -------------------------------
  let startSlotMinutes = existingBooking.startSlotMinutes;
  let endSlotMinutes = existingBooking.endSlotMinutes;

  if (startSlot) {
    updates.startSlot = startSlot;
    startSlotMinutes = timeToMinutes(startSlot);
    updates.startSlotMinutes = startSlotMinutes;

    // adjust endSlot if duration exists
    const currentDuration = duration || existingBooking.duration;
    endSlotMinutes = startSlotMinutes + currentDuration * 60;
    updates.endSlotMinutes = endSlotMinutes;
    updates.endSlot = `${Math.floor(endSlotMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(endSlotMinutes % 60).toString().padStart(2, "0")}`;
    updates.duration = currentDuration;
  }

  // -------------------------------
  // Handle duration update
  // -------------------------------
  if (duration) {
    updates.duration = duration;
    const currentStartMinutes =
      startSlotMinutes || existingBooking.startSlotMinutes;
    endSlotMinutes = currentStartMinutes + duration * 60;
    updates.endSlotMinutes = endSlotMinutes;
    updates.endSlot = `${Math.floor(endSlotMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(endSlotMinutes % 60).toString().padStart(2, "0")}`;
  }

  // -------------------------------
  // Handle package update
  // -------------------------------
  let packagePrice = existingBooking.totalPackagePrice || 0;
  let packageDoc = null;

  if (selectedPackage || duration) {
    packageDoc = await PackageModel.findById(
      selectedPackage?.id || selectedPackage || updates.package._id
    );

    if (!packageDoc) throw new AppError(404, "Package not found");

    updates.package = packageDoc._id;

    // recalculate package price
    const calculatedDuration = updates.duration || existingBooking.duration;
    const slotPrices = await calculateSlotPrices({
      package: packageDoc,
      date: updates.date,
      startSlotMinutes: updates.startSlotMinutes,
      endOfDay: updates.endSlotMinutes,
      duration: calculatedDuration,
      bookedSlots: [],
    });

    packagePrice = slotPrices[slotPrices.length - 1].totalPrice;
    updates.totalPackagePrice = packagePrice;
  }

  // -------------------------------
  // Handle add-ons update
  // -------------------------------
  // Handle add-ons update
  let totalAddOnsPriceFromDb = existingBooking.totalAddOnsPrice || 0;
  const addOnDetails = existingBooking.addOns || [];

  if (selectedAddOns) {
    totalAddOnsPriceFromDb = 0;
    addOnDetails.length = 0;

    const addOnIds = selectedAddOns.map((a) => a.id || a.item?._id || a.item);
    const addOnDocs = await AddOnModel.find({ _id: { $in: addOnIds } });

    for (let i = 0; i < selectedAddOns.length; i++) {
      const clientAddOn = selectedAddOns[i];
      const dbAddOn = addOnDocs.find(
        (doc) =>
          doc._id.toString() ===
          (
            clientAddOn.id ||
            clientAddOn.item?._id ||
            clientAddOn.item
          ).toString()
      );
      if (!dbAddOn) continue;

      const quantity = clientAddOn.quantity || 1;
      const addOnItemPrice = dbAddOn.price * quantity;
      totalAddOnsPriceFromDb += addOnItemPrice;

      addOnDetails.push({
        item: dbAddOn._id,
        quantity,
        price: dbAddOn.price,
      });
    }

    updates.addOns = addOnDetails;
    updates.totalAddOnsPrice = totalAddOnsPriceFromDb;
  }

  // -------------------------------
  // Total price & coupon
  // -------------------------------
  updates.totalPrice = Math.round(packagePrice + totalAddOnsPriceFromDb);
  if (coupon_code) {
    const coupon = await CouponModel.findOne({ code: coupon_code });
    if (coupon && coupon.discount) {
      const discountAmount = Math.round(packagePrice * (coupon.discount / 100));
      updates.totalPriceAfterDiscount = Math.round(
        packagePrice - discountAmount + totalAddOnsPriceFromDb
      );
    } else {
      updates.totalPriceAfterDiscount = updates.totalPrice;
    }
  } else {
    updates.totalPriceAfterDiscount = updates.totalPrice;
  }

  return updates;
};

module.exports = prepareBookingDataForEdit;
