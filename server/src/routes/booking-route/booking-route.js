const express = require("express");
const router = express.Router();
const bookingController = require("../../controller/booking-controller/booking-controller");

// get Fully booked dates for a studio
router.route("/fully-booked/:studioId").get(bookingController.getFullyBookedDates);
router.route("/available-slots").post(bookingController.getAvailableSlots);

module.exports = router; 