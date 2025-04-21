const express = require("express");
const router = express.Router();

const allowTo = require("../../middleware/allow-to-middleware");
const protectRoute = require("../../middleware/protect.middleware");
const { USER_ROLE } = require("../../config/system-variables");
const bookingController = require("../../controller/booking-controller/booking-controller");

// get Fully booked dates for a studio
router.route("/fully-booked/:studioId").get(bookingController.getFullyBookedDates);
router.route("/available-slots").post(bookingController.getAvailableSlots);

router.use(protectRoute, allowTo(USER_ROLE.ADMIN))
router.route("/").get(bookingController.getAllBookings);
router.route("/:id").put(bookingController.changeBookingStatus);
module.exports = router; 