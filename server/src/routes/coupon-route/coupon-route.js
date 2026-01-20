const express = require("express");
const router = express.Router();

const couponController = require("../../controller/coupon-controller/coupon-controller");
const protectRoute = require("../../middleware/protect.middleware");
const allowTo = require("../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../config/system-variables");

router.route("/apply-coupon").post(couponController.applyCoupon);
router.route("/get-auto-apply-coupon").get(couponController.getAutoApplyCoupon);

router.use(protectRoute, allowTo(USER_ROLE.ADMIN));

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .delete(couponController.deleteCoupon)
  .put(couponController.updateCoupon);

router.route("/change-status/:id").put(couponController.editCouponActiveState);

module.exports = router;
