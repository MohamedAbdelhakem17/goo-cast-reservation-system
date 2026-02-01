const express = require("express");
const router = express.Router();

// ────────────────────────────────
//  Middlewares
// ────────────────────────────────
const allowTo = require("../../../../middleware/allow-to-middleware");
const protectRoute = require("../../../../middleware/protect.middleware");
const allowPolicy = require("../../../../middleware/check-permission.middleware");

// ────────────────────────────────
//  Constants
// ────────────────────────────────
const {
  USER_ROLE,
  POLICIES_ROLES,
} = require("../../../../config/system-variables");

// ────────────────────────────────
//  Controllers and Models
// ────────────────────────────────
const PromotionController = require("../../controllers/promotion-controller/promotion-controller");

// ────────────────────────────────
//  Public Routes
// ────────────────────────────────
router.route("/active").get(PromotionController.getActivePromotions);

// ────────────────────────────────
//  Private / Admin & Manager Routes
// ────────────────────────────────

// Apply protectRoute + permission middleware for all following routes
router.use(
  protectRoute,
  allowTo(USER_ROLE.ADMIN),
  allowPolicy(POLICIES_ROLES.MANAGE_SETTING),
);

// Admin create and get Promotion
router
  .route("/")
  .post(PromotionController.createNwPromotion)
  .get(PromotionController.getAllPromotions);

// Get / update single and delete promotion
router
  .route("/:id")
  .get(PromotionController.getPromotionById)
  .put(PromotionController.updatedPromotion)
  .delete(PromotionController.deletePromotion);

// ────────────────────────────────
//  Export Router
// ────────────────────────────────
module.exports = router;
