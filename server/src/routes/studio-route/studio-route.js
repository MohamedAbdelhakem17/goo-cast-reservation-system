const express = require("express");
const router = express.Router();

const allowTo = require("../../middleware/allow-to-middleware");
const studioController = require("../../controller/studio-controller/studio-controller");
const { USER_ROLE } = require("../../config/system-variables");
const protectRoute = require("../../middleware/protect.middleware");

router
  .route("/")
  .get(studioController.getAllStudios)
  .post(
    protectRoute,
    allowTo(USER_ROLE.ADMIN),
    studioController.studioImageUpload,
    studioController.imageManipulation,
    studioController.createStudio
  );

router
  .route("/:id")
  .get(studioController.getStudioById)
  .delete(protectRoute, allowTo(USER_ROLE.ADMIN), studioController.deleteStudio)
  .put(
    protectRoute,
    allowTo(USER_ROLE.ADMIN),
    studioController.studioImageUpload,
    studioController.imageManipulation,
    studioController.updateStudio
  );

router.put(
  "/changePrice/:id",
  protectRoute,
  allowTo(USER_ROLE.ADMIN),
  studioController.changePrice
);

module.exports = router;
