const CouponModel = require("../models/coupon-model/coupon-model");
const AppError = require("./app-error");
const { HTTP_STATUS_TEXT } = require("../config/system-variables");

const checkCouponIsValid = async ({ coupon_id, user_id, email }) => {
  // if (!user_id && !email) {
  //   throw new AppError(
  //     400,
  //     HTTP_STATUS_TEXT.FAIL,
  //     "Please provide either user_id or email"
  //   );
  // }

  const coupon = await CouponModel.findOne({ code: coupon_id });

  if (!coupon) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Coupon not found");
  }

  if (coupon.expires_at < Date.now()) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Coupon is expired");
  }

  // // check by user_id
  // if (user_id && coupon.user_id_used.includes(user_id)) {
  //   throw new AppError(
  //     400,
  //     HTTP_STATUS_TEXT.FAIL,
  //     "Coupon already used by this user"
  //   );
  // }

  // // check by email
  // const emailLower = email?.toLowerCase();
  // if (emailLower && coupon.user_email_used.includes(emailLower)) {
  //   throw new AppError(
  //     400,
  //     HTTP_STATUS_TEXT.FAIL,
  //     "Coupon already used by this email"
  //   );
  // }

  // check max uses
  const totalUses = coupon.user_id_used.length + coupon.user_email_used.length;
  if (totalUses >= coupon.max_uses) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "Coupon usage limit exceeded"
    );
  }

  // ✅ Save usage based on provided field
  if (user_id) {
    coupon.user_id_used.push(user_id);
  }

  if (emailLower) {
    coupon.user_email_used.push(emailLower);
  }

  await coupon.save();

  return {
    valid: true,
    discount: coupon.discount,
  };
};

module.exports = checkCouponIsValid;
