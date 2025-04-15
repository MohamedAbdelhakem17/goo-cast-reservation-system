const express = require('express');
const router = express.Router();
const authController = require('../../controller/auth-controller/auth-controller');


router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/resend-activation-link', authController.resendActivationLink);
router.get('/activate/:token', authController.activateEmail);
// actionUrl = `${baseUrl}/activate?token=${token}`;


router.post('/signout', authController.signout);

router.put('/reset-password', authController.resetPassword);
router.put('/update-password', authController.updatePassword);

module.exports = router;    