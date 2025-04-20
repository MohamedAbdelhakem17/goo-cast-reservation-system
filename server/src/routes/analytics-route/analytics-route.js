const express = require('express');
const router = express.Router();
const analyticsController = require('../../controller/analytics-controller/analytics-controller');

router.route('/').get(analyticsController.getAnalytics).post(analyticsController.addAnalytics);

module.exports = router;