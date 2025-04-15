const express = require('express');
const router = express.Router();

const allowTo = require('../../middleware/allow-to-middleware');
const studioController = require('../../controller/studio-controller/studio-controller');
const protectRoute = require('../../middleware/protect.middleware');
const { USER_ROLE } = require('../../config/system-variables');

router
    .route('/')
    .get(studioController.getAllStudios)
    .post(
        allowTo(USER_ROLE.ADMIN),
        studioController.studioImageUpload,
        studioController.imageManipulation,
        studioController.createStudio
    );

router
    .route('/:id')
    .get(studioController.getStudioById)
    .delete(allowTo(USER_ROLE.ADMIN), studioController.deleteStudio)
    .put(
        protectRoute,
        allowTo(USER_ROLE.ADMIN),
        studioController.studioImageUpload,
        studioController.imageManipulation,
        studioController.updateStudio
    );

module.exports = router;
