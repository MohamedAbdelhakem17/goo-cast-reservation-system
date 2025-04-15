const express = require('express');
const hourlyPackageController = require('../../controller/hourly-package-controller/hourly-package-controller');
const protect = require('../../middleware/protect.middleware');
const allowTo = require('../../middleware/allow-to-middleware');

const router = express.Router();
router.route('/').get(hourlyPackageController.getAllHourlyPackages) // Get all hourly packages

// Protect all routes after this middleware
router.use(protect, allowTo("admin"));

router.route('/')
    .post(hourlyPackageController.createHourlyPackage); // Create a new hourly packages

router.route('/:id')
    .put(hourlyPackageController.updateHourlyPackage) // Update hourly packages by ID    
    .delete(hourlyPackageController.deleteHourlyPackage); // Delete hourly packages by ID


module.exports = router;