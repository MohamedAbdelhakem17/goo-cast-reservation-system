require("../../controller/auth-controller/auth/login-with-google");
require("../../controller/auth-controller/auth/login-with-local");

const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../../controller/auth-controller/auth-controller");
const protectRoute = require("../../middleware/protect.middleware");

// Local Auth
router.post("/login", authController.login);

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/resend-activation-link", authController.resendActivationLink);
router.get("/activate/:token", authController.activateEmail);

const SUCCESS_DIR = process.env.BASE_URL + "/login/success";
const FAILURE_DIR = process.env.BASE_URL + "/login/failure";

router.post("/signout", protectRoute, authController.signout);

router.put("/reset-password", authController.resetPassword);

router.get("/is-login", authController.isLogin);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: FAILURE_DIR,
    session: false,
  }),
  (req, res) => {
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage(${JSON.stringify(userData)}, "*");
            window.location.href = "/success-login";
          </script>
        </body>
      </html>
    `;

    res.send(html);
  }
);

module.exports = router;
