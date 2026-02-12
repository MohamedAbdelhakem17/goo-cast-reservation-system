const express = require("express");
const hourlyPackageController = require("../../controller/hourly-package-controller/hourly-package-controller");
const protect = require("../../../../middleware/protect.middleware");
const allowTo = require("../../../../middleware/allow-to-middleware");

const router = express.Router();
router.route("/").get(hourlyPackageController.getAllHourlyPackages); // Get all hourly packages
router
  .route("/category/:category")
  .get(hourlyPackageController.getHourlyPackagesByCategory);

router
  .route("/change-status/:id")
  .put(hourlyPackageController.toggleHourlyPackagesStatus);

// Protect all routes after this middleware
router.use(protect, allowTo("admin"));

router
  .route("/")
  .post(
    hourlyPackageController.serviceImageUpload,
    hourlyPackageController.serviceImageManipulation,
    hourlyPackageController.createHourlyPackage,
  ); // Create a new hourly packages

router
  .route("/:id")
  .get(hourlyPackageController.getOneHourlyPackage)
  .put(
    hourlyPackageController.serviceImageUpload,
    hourlyPackageController.serviceImageManipulation,
    hourlyPackageController.updateHourlyPackage,
  ) // Update hourly packages by ID
  .delete(hourlyPackageController.deleteHourlyPackage); // Delete hourly packages by ID

router.put("/price-mange/:id", hourlyPackageController.packagePriceMange);

router.get("/bundle/:slug", hourlyPackageController.getOneBundleHourlyPackage);
router.get("/bundles", hourlyPackageController.getBundleHourlyPackage);

module.exports = router;
