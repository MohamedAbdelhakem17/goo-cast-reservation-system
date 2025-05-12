const express = require("express");

const router = express.Router();

const userController = require("../../controller/user-controller/user-controller");
const protectRoute = require("../../middleware/protect.middleware");
const allowTo = require("../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../config/system-variables");

router.use(protectRoute, allowTo(USER_ROLE.USER));

router
  .route("/")
  .get(userController.getUserData)
  .put(userController.updateUserData);

router.get("/user-stats", userController.getUserStats);
router.put("/edit-password", userController.editLoginUserPassword);

module.exports = router;
