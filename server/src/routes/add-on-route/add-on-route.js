const express = require('express');
const addOnController = require('../../controller/add-on-controller/add-on-controller');
const protect = require('../../middleware/protect.middleware');
const allowTo = require('../../middleware/allow-to-middleware');

const router = express.Router();
router.route('/').get(addOnController.getAllAddOns) // Get all add-ons

// Protect all routes after this middleware
router.use(protect, allowTo("admin"));

router.route('/')
    .post(addOnController.createAddOn); // Create a new add-on

router.route('/:id')
    .put(addOnController.updateAddOn) // Update add-on by ID    
    .delete(addOnController.deleteAddOn); // Delete add-on by ID


module.exports = router;