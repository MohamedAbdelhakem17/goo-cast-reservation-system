const express = require("express");

const router = express.Router();

const AuditController = require("../../controller/audit-controller/audit-controller");

const protectRoute = require("../../middleware/protect.middleware");
const allowTo = require("../../middleware/allow-to-middleware");

const { USER_ROLE } = require("../../config/system-variables");

router.use(protectRoute, allowTo(USER_ROLE.ADMIN, USER_ROLE.MANAGER));

router.route("/:targetId").get(AuditController.getLog);

module.exports = router;
