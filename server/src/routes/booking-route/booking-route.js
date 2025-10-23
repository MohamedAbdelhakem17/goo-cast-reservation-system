const express = require("express");
const router = express.Router();

const allowTo = require("../../middleware/allow-to-middleware");
const protectRoute = require("../../middleware/protect.middleware");
const { USER_ROLE } = require("../../config/system-variables");
const bookingController = require("../../controller/booking-controller/booking-controller");

// // get Fully booked dates for a studio
// router
//   .route("/fully-booked/:studioId")
//   .get(bookingController.getFullyBookedDates);

router.route("/fully-booked").get(bookingController.getFullyBookedDates);

router
  .route("/available-studios/:date/:categoryId")
  .get(bookingController.getAvailableStudios);

router.route("/available-slots").post(bookingController.getAvailableStartSlots);

router
  .route("/available-end-slots")
  .post(bookingController.getAvailableEndSlots);

router.route("/").post(bookingController.createBooking);
router.route("/create/ghl").post(bookingController.ghlCreateBooking);

router.route("/change-status/ghl").put(bookingController.changeBookingStatus);

router.use(protectRoute);

router
  .route("/")
  .get(allowTo(USER_ROLE.ADMIN), bookingController.getAllBookings);

router
  .route("/")
  .put(allowTo(USER_ROLE.ADMIN), bookingController.changeBookingStatus);

router
  .route("/:id")
  .get(allowTo(USER_ROLE.ADMIN), bookingController.getSingleBooking)
  .put(allowTo(USER_ROLE.ADMIN), bookingController.updateBooking);

router
  .route("/user-bookings")
  .get(allowTo(USER_ROLE.USER), bookingController.getUserBookings);

module.exports = router;
