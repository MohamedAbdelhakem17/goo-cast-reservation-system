const express = require('express');
const router = express.Router();
const authController = require('../../controller/auth-controller/auth-controller');

console.log(authController)

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);


// router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.post('/signout', authController.signout);
router.patch('/update-password', authController.updatePassword);

module.exports = router;    