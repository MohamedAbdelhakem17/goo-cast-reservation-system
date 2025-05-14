const asyncHandler = require("express-async-handler");
const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const checkCouponIsValid = require("../../utils/check-coupon-is-valid");
const CouponModel = require("../../models/coupon-model/coupon-model");

// get all coupons
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await CouponModel.find();
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: coupons,
  });
});

// create coupon
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const { name, discount, expires_at, max_uses, code } = req.body;

  if (!name || !discount || !expires_at || !max_uses || !code) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "Please provide all required fields"
    );
  }

  const coupon = await CouponModel.create({
    name,
    discount,
    expires_at,
    code,
    max_uses,
  });

  res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Coupon created successfully",
    data: coupon,
  });
});

// update coupon
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await CouponModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Coupon not found");
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

// delete coupon
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await CouponModel.findByIdAndDelete(id);

  if (!coupon) {
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.FAIL,
      "No coupon found with this ID"
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: null,
    message: "Coupon deleted successfully",
  });
});

// ِApply coupon
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { coupon_id, user_id, email } = req.body;
  const result = await checkCouponIsValid({ coupon_id, user_id, email });
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Coupon is valid and applied successfully",
    data: {
      discount: result.discount,
    },
  });
});
