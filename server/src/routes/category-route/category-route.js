const express = require('express');

const router = express.Router();

const CategoryController = require('../../controller/category-controller/category-controller');

const protectRoute = require('../../middleware/protect.middleware');
const allowTo = require('../../middleware/allow-to-middleware');

const { USER_ROLE } = require('../../config/system-variables');


router.route('/')
    .get(CategoryController.getAllCategories);

router.use(protectRoute, allowTo(USER_ROLE.ADMIN))

router.route('/')
    .delete(CategoryController.addCategory)

router.route('/:id')
    .delete(CategoryController.deleteCategory)
    .put(CategoryController.updateCategory);


module.exports = router;