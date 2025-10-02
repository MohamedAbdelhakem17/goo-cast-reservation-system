const express = require("express");
const router = express.Router();

const allowTo = require("../../middleware/allow-to-middleware");
const protectRoute = require("../../middleware/protect.middleware");
const { USER_ROLE } = require("../../config/system-variables");
const analyticsController = require("../../controller/analytics-controller/analytics-controller");

router.route("/").post(analyticsController.addAnalytics);

// Protected admin routes
// router.use(protectRoute, allowTo(USER_ROLE.ADMIN));

router.route("/dashboard-stats").get(analyticsController.getDashboardStats);
router.route("/").get(analyticsController.getAnalytics);

module.exports = router;
