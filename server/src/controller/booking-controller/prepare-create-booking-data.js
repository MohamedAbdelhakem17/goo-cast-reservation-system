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
  BOOKING_PIPELINE,
} = require("../../config/system-variables.js");

const { calculateSlotPrices } = require("../../utils/priceCalculator.js");
const { getAllDay, timeToMinutes } = require("../../utils/time-mange.js");
const userProfileModel = require("../../models/user-profile-model/user-profile-model.js");
const determineUserTags = require("../../utils/tag-engine.js");

const prepareEditBookingData = async (body, user, isEdit = false) => {
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

  // User Profile
  const userBooked = await userProfileModel.findOne({
    $or: [{ email: personalInfo.email }, { phone: personalInfo.phone }],
  });

  let userId;

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

  // Parse booking date and time
  const bookingDate = new Date(date);
  const startSlotMinutes = timeToMinutes(startSlot);
  const endSlotMinutes = timeToMinutes(endSlot);

  // 1. Validate Studio
  const studio = await StudioModel.findById(studioId?.id || studioId);
  if (!studio)
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.FAIL,
      "Studio not found for booking"
    );

  // 2. Validate Package
  const pkg = await PackageModel.findById(
    selectedPackage?.id || selectedPackage
  );

  if (!pkg)
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.FAIL,
      "Package not found for booking"
    );

  // 3. Check for booking conflicts (skip self if editing)
  const { startOfDay, endOfDay } = getAllDay(bookingDate);
  const conflictQuery = {
    studio: studio._id,
    date: { $gte: startOfDay, $lt: endOfDay },
    startSlotMinutes: { $lt: endSlotMinutes },
    endSlotMinutes: { $gt: startSlotMinutes },
  };

  if (isEdit && bookingId) {
    conflictQuery._id = { $ne: bookingId };
  }

  const conflictBooking = await BookingModel.exists(conflictQuery);

  if (conflictBooking)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "This time is already booked"
    );

  // 4. Calculate package price
  const slotPrices = await calculateSlotPrices({
    package: pkg,
    date: bookingDate,
    startSlotMinutes,
    endOfDay: endSlotMinutes,
    duration,
    bookedSlots: [],
  });

  const packagePrice = slotPrices[slotPrices.length - 1].totalPrice;

  // 5. Validate and calculate Add-ons
  const addonsTotalPriceFromClient =
    selectedAddOns?.reduce(
      (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
      0
    ) || 0;

  let totalAddOnsPriceFromDb = 0;
  const addOnDetails = [];

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
  }

  if (totalAddOnsPriceFromDb !== addonsTotalPriceFromClient)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "The add-on price is incorrect"
    );

  // 6. Validate total price
  const totalPrice = Math.round(packagePrice + totalAddOnsPriceFromDb);

  if (!isEdit && totalPrice !== totalPriceFromClient)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "The total price is incorrect"
    );

  // 7. Apply coupon if available
  const coupon = await CouponModel.findOne({ code: coupon_code });
  if (!coupon && coupon_code)
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Coupon not found");

  const totalPriceAfterDiscount = coupon?.discount
    ? Math.round(
        packagePrice -
          packagePrice * (coupon.discount / 100) +
          totalAddOnsPriceFromDb
      )
    : totalPrice;

  if (!isEdit && totalPriceAfterDiscount !== totalPriceAfterDiscountFromClient)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "The total price after Discount is incorrect"
    );

  // 8. Validate payment method
  if (paymentMethod && !Object.values(PAYMENT_METHOD).includes(paymentMethod))
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid payment method");

  // 9. Identify user role
  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const Admin = isAdmin ? user?._id : null;

  // 10. Prepare booking data
  const bookingData = {
    studio: studio._id,
    date: bookingDate,
    startSlot,
    endSlot,
    startSlotMinutes,
    endSlotMinutes,
    duration,
    persons,
    package: pkg._id,
    addOns: addOnDetails,
    totalAddOnsPrice: totalAddOnsPriceFromDb,
    totalPackagePrice: packagePrice,
    personalInfo: userId,
    extraComments: personalInfo.comments,
    totalPrice,
    totalPriceAfterDiscount,
    paymentMethod: paymentMethod || PAYMENT_METHOD.CASH,
    status: BOOKING_PIPELINE.NEW,
    createdBy: Admin,
  };

  // 11. Return either new booking or update data
  const tempBooking = isEdit
    ? null // In edit mode we don't create a new model
    : new BookingModel(bookingData);

  return {
    tempBooking,
    bookingData,
    studio,
    pkg,
    addOns: selectedAddOns,
    totalAddOnsPriceFromDb,
    bookingDate,
    personalInfo,
    startSlot,
    endSlot,
    totalPriceAfterDiscount,
    startSlotMinutes,
    endSlotMinutes,
    duration,
  };
};

module.exports = prepareEditBookingData;
