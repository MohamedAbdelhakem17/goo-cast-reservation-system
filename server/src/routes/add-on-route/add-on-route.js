const express = require("express");
const addOnController = require("../../controller/add-on-controller/add-on-controller");
const protect = require("../../middleware/protect.middleware");
const allowTo = require("../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../config/system-variables");

const router = express.Router();
router.route("/").get(addOnController.getAllAddOns); // Get all add-ons

// Protect all routes after this middleware
router.use(protect, allowTo(USER_ROLE.ADMIN));

router
  .route("/")
  .post(
    addOnController.addonsImageUpload,
    addOnController.addonsImageManipulation,
    addOnController.createAddOn
  ); // Create a new add-on

router
  .route("/:id")
  .put(
    addOnController.addonsImageUpload,
    addOnController.addonsImageManipulation,
    addOnController.updateAddOn
  ) // Update add-on by ID
  .delete(addOnController.deleteAddOn); // Delete add-on by ID

router.route("/change-status/:id").put(addOnController.toggleAddOnStatus);
module.exports = router;
