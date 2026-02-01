const express = require("express");

const router = express.Router();

const adminController = require("../../controller/admin-controller/admin-controller");
const protectRoute = require("../../../../middleware/protect.middleware");
const allowTo = require("../../../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../../../config/system-variables");

router.use(protectRoute, allowTo(USER_ROLE.ADMIN));

router
  .route("/")
  .get(adminController.getAllAdmins)
  .post(adminController.createAdmin);

router.route("/change-status/:id").put(adminController.toggleStudioStatus);

module.exports = router;
