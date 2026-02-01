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
//  Controllers
// ────────────────────────────────
const analyticsController = require("../../controller/analytics-controller/analytics-controller");

// ────────────────────────────────
//  Public Routes
// ────────────────────────────────
router.route("/").post(analyticsController.addAnalytics);

// ────────────────────────────────
//  Protected Routes (Admin & Manager)
// ────────────────────────────────
router.use(
  protectRoute,
  allowTo(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  allowPolicy(POLICIES_ROLES.MANAGE_DASHBOARD),
);

// Get dashboard stats
router.route("/dashboard-stats").get(analyticsController.getDashboardStats);

// Get all analytics
router.route("/").get(analyticsController.getAnalytics);

// ────────────────────────────────
//  Export Router
// ────────────────────────────────
module.exports = router;
