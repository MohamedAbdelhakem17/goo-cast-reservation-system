const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require("uuid");


const { uploadMultipleImages } = require('../../middleware/image-upload-middleware');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');
const StudioModel = require('../../models/studio-model/studio-model');

// studio image upload
exports.studioImageUpload = uploadMultipleImages([
    {
        name: "thumbnail",
        maxCount: 1,
    },
    {
        name: "imagesGallery",
        maxCount: 5,
    },
]);
// studio image upload Store 
exports.imageManipulation = async (req, res, next) => {
    // upload Thumbnail
    if (req.files.thumbnail) {
        const thumbnailName = `studio-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.files.thumbnail[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/studio/${thumbnailName}`);
        req.body.thumbnail = thumbnailName;
    }

    // upload imagesGallery
    if (req.files.imagesGallery) {
        req.body.imagesGallery = [];
        await Promise.all(
            req.files.imagesGallery.map(async (file, index) => {
                const imageName = `studio-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/studio/${imageName}`);
                req.body.imagesGallery.push(imageName);
            })
        );
    }

    next();
}
// gat all studios
exports.getAllStudios = asyncHandler(async (req, res) => {
    const studios = await StudioModel.find();

    if (studios.length === 0) {
        res.status(404).json({
            status: HTTP_STATUS_TEXT.FAIL,
            message: "No studios found"
        })
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: studios
    });
});

// get studio by id
exports.getStudioById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studio = await StudioModel.findById(id);
    if (!studio) {
        res.status(404).json({
            status: HTTP_STATUS_TEXT.FAIL,
            message: "Studio not found"
        })
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: studio
    });
});

// create a new studio
exports.createStudio = asyncHandler(async (req, res) => {
    const studio = await StudioModel.create(req.body);

    if (!studio) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Studio not created");
    }

    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: studio,
        message: "Studio created successfully"
    });
});

// update a studio
exports.updateStudio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studio = await StudioModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!studio) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found");
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: studio,
        message: "Studio updated successfully"
    });
});

// delete a studio
exports.deleteStudio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studio = await StudioModel.findByIdAndDelete(id);

    if (!studio) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found");
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: null,
        message: "Studio deleted successfully"
    });
});