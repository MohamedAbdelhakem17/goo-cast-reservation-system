const express = require("express");
const router = express.Router();

// ────────────────────────────────
//  Middlewares
// ────────────────────────────────
const allowTo = require("../../../../middleware/allow-to-middleware");
const protectRoute = require("../../../../middleware/protect.middleware");
const allowPolicy = require("../../../../middleware/check-permission.middleware");
const { audit } = require("../../../../middleware/audit-middleware");

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
const bookingController = require("../../controller/booking-controller/booking-controller");
const bookingModels = require("../../../../models/booking-model/booking-model");

// ────────────────────────────────
//  Public Routes
// ────────────────────────────────
router.route("/fully-booked").get(bookingController.getFullyBookedDates);

router
  .route("/available-studios/:date/:categoryId")
  .get(bookingController.getAvailableStudios);

router.route("/available-slots").post(bookingController.getAvailableStartSlots);

router
  .route("/available-end-slots")
  .post(bookingController.getAvailableEndSlots);

router.route("/").post(bookingController.createBooking);
router.route("/n8n").post(bookingController.n8nBooking);

router.route("/change-status/ghl").put(bookingController.changeBookingStatus);

// ────────────────────────────────
//  User Routes
// ────────────────────────────────
router
  .route("/user-bookings")
  .get(allowTo(USER_ROLE.USER), bookingController.getUserBookings);

// ────────────────────────────────
//  Private / Admin & Manager Routes
// ────────────────────────────────

// Apply protectRoute + permission middleware for all following routes
router.use(
  protectRoute,
  allowTo(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  allowPolicy(POLICIES_ROLES.MANAGE_CRM),
);

// Admin create booking
router.route("/admin/create").post(bookingController.createBooking);

// Get all bookings
router
  .route("/")
  .get(bookingController.getAllBookings)
  .put(audit(bookingModels), bookingController.changeBookingStatus);

// Get / update single booking
router
  .route("/:id")
  .get(bookingController.getSingleBooking)
  .put(audit(bookingModels), bookingController.updateBooking);

// ────────────────────────────────
//  Export Router
// ────────────────────────────────
module.exports = router;

// router.route("/create/ghl").post(bookingController.ghlCreateBooking);
