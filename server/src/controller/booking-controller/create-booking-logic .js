const PackageModel = require("../../models/hourly-packages-model/hourly-packages-model");
const BookingModel = require("../../models/booking-model/booking-model");
const StudioModel = require("../../models/studio-model/studio-model");
const AddOnModel = require("../../models/add-on-model/add-on-model");
const CouponModel = require("../../models/coupon-model/coupon-model.js");
const AppError = require("../../utils/app-error");
const {
  HTTP_STATUS_TEXT,
  PAYMENT_METHOD,
} = require("../../config/system-variables");

const { calculateSlotPrices } = require("../../utils/priceCalculator");
const { getAllDay, timeToMinutes } = require("../../utils/time-mange");

const createBookingLogic = async (body, user_id) => {
  const {
    studio: studioId,
    date,
    startSlot,
    endSlot,
    duration,
    persons,
    package: selectedPackage,
    selectedAddOns,
    personalInfo,
    totalPrice: totalPriceFromClient,
    totalPriceAfterDiscount: totalPriceAfterDiscountFromClient,
    coupon_code,
    paymentMethod,
  } = body;


  const bookingDate = new Date(date);
  const startSlotMinutes = timeToMinutes(startSlot);
  const endSlotMinutes = timeToMinutes(endSlot);

  const studio = await StudioModel.findById(studioId?.id || studioId);
  if (!studio)
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.FAIL,
      "Studio not found for booking"
    );

  const pkg = await PackageModel.findById(
    selectedPackage?.id || selectedPackage
  );
  if (!pkg)
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.FAIL,
      "Package not found for booking"
    );

  const { startOfDay, endOfDay } = getAllDay(bookingDate);
  const conflictBooking = await BookingModel.exists({
    studio: studio._id,
    date: { $gte: startOfDay, $lt: endOfDay },
    startSlotMinutes: { $lt: endSlotMinutes },
    endSlotMinutes: { $gt: startSlotMinutes },
  });
  if (conflictBooking)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "This time is already booked"
    );

  const slotPrices = await calculateSlotPrices({
    package: pkg,
    date: bookingDate,
    startSlotMinutes,
    endOfDay: endSlotMinutes,
    bookedSlots: [],
  });
  const packagePrice = slotPrices[slotPrices.length - 1].totalPrice;

  const addonsTotalPriceFromClient =
    selectedAddOns?.reduce(
      (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
      0
    ) || 0;

  let totalAddOnsPriceFromDb = 0;
  const addOnDetails = [];

  if (Array.isArray(selectedAddOns)) {
    const addOnDocs = await Promise.all(
      selectedAddOns.map((a) => AddOnModel.findById(a._id))
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

  const totalPrice = Math.round(
    packagePrice +
    totalAddOnsPriceFromDb 
  );
  if (totalPrice !== totalPriceFromClient)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "The total price is incorrect"
    );

  const coupon = await CouponModel.findOne({ code: coupon_code });
  if (!coupon && coupon_code)
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Coupon not found");

  const totalPriceAfterDiscount = coupon?.discount
    ? Math.round(totalPrice - totalPrice * (coupon.discount / 100))
    : totalPrice;

  if (totalPriceAfterDiscount !== totalPriceAfterDiscountFromClient)
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "The total price after Discount is incorrect"
    );

  if (paymentMethod && !Object.values(PAYMENT_METHOD).includes(paymentMethod))
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid payment method");

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
    personalInfo,
    totalPrice,
    totalPriceAfterDiscount,
    status: "pending",
    createdBy: user_id,
    isGuest: !user_id,
    paymentMethod: paymentMethod || PAYMENT_METHOD.CASH,
  };

  const tempBooking = new BookingModel(bookingData);

  return {
    tempBooking,
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
    duration
  };
};

module.exports = createBookingLogic;
