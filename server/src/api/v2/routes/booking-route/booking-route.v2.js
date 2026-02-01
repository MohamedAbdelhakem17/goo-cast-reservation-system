const express = require("express");
const router = express.Router();

const bookingController = require("../../controllers/booking-controller/booking-controllers.v2");

router
  .route("/available-studios")
  .get(bookingController.getStudiosAvailability);

router.route("/available-slots").post(bookingController.getAvailableStartSlots);

module.exports = router;
