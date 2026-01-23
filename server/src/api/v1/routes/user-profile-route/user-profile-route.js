const express = require("express");
const router = express.Router();

// ────────────────────────────────
//  Middlewares
// ────────────────────────────────
const allowTo = require("../../middleware/allow-to-middleware");
const protectRoute = require("../../middleware/protect.middleware");
const allowPolicy = require("../../middleware/check-permission.middleware");

// ────────────────────────────────
//  Constants
// ────────────────────────────────
const { USER_ROLE, POLICIES_ROLES } = require("../../config/system-variables");

// ────────────────────────────────
//  Controllers
// ────────────────────────────────
const UserProfileController = require("../../controller/user-profile-controller/user-profile-controller");

// ────────────────────────────────
//  Routes
// ────────────────────────────────

router.use(
  protectRoute,
  allowTo(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  allowPolicy(POLICIES_ROLES.MANAGE_CRM)
);

// Get all users profiles
router.route("/").get(UserProfileController.getAllUsersProfiles);

// Get single user profile by ID
router.route("/:id").get(UserProfileController.getUserProfile);

// ────────────────────────────────
//  Export Router
// ────────────────────────────────
module.exports = router;
