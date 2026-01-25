const express = require("express");

const router = express.Router();

const userController = require("../../controller/user-controller/user-controller");
const protectRoute = require("../../../../middleware/protect.middleware");
const allowTo = require("../../../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../../../config/system-variables");

router.use(protectRoute);

router
  .route("/")
  .get(allowTo(USER_ROLE.USER), userController.getUserData)
  .put(allowTo(USER_ROLE.USER), userController.updateUserData);

router.get("/user-stats", allowTo(USER_ROLE.USER), userController.getUserStats);
router.put(
  "/edit-password",
  allowTo(USER_ROLE.USER),
  userController.editLoginUserPassword,
);

router.route("/all").get(allowTo(USER_ROLE.ADMIN), userController.getAllUsers);
router
  .route("/workspace-mange")
  .post(allowTo(USER_ROLE.ADMIN), userController.manageWorkSpace);

module.exports = router;
