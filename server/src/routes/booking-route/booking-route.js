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
const bookingController = require("../../controller/booking-controller/booking-controller");

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
  allowPolicy(POLICIES_ROLES.MANAGE_CRM)
);

// Get all bookings
router
  .route("/")
  .get(bookingController.getAllBookings)
  .put(bookingController.changeBookingStatus);

// Get / update single booking
router
  .route("/:id")
  .get(bookingController.getSingleBooking)
  .put(bookingController.updateBooking);

// ────────────────────────────────
//  Export Router
// ────────────────────────────────
module.exports = router;

// router.route("/create/ghl").post(bookingController.ghlCreateBooking);
