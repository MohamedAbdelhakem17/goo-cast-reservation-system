const express = require('express');

const router = express.Router();

const priceExceptionController = require('../../controller/price-exception-controller/price-exception-controller');

const protectRoute = require('../../middleware/protect.middleware');
const allowTo = require('../../middleware/allow-to-middleware');
const { USER_ROLE } = require('../../config/system-variables');

// router.use(protectRoute, allowTo(USER_ROLE.ADMIN))

router.route('/')
    .post(priceExceptionController.addNewPriceException)
    .delete(priceExceptionController.deletePriceException)
    .put(priceExceptionController.editPriceException);

router.route('/:id')
    .get(priceExceptionController.getAllPriceExceptions)


module.exports = router;