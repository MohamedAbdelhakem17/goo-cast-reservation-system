const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const { uploadSingleImage } = require("../../middleware/image-upload-middleware");
const AddOnModel = require("../../models/add-on-model/add-on-model");

exports.addonsImageUpload = uploadSingleImage("image");

exports.addonsImageManipulation = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    if (req.body.imageUrl) return next();

    if (!req.file) {
        return next(
            new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please upload an image")
        );
    }
    const imageName = `addons-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize({ width: 300, height: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/addons/${imageName}`);

    req.body.image = imageName;
    next();
});
// get all add-ons
exports.getAllAddOns = asyncHandler(async (req, res, next) => {
    const addOns = await AddOnModel.find();
    if (addOns.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-ons found"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: addOns,
    });
});

exports.createAddOn = asyncHandler(async (req, res, next) => {
    const { name, description, price, image, perHourDiscounts, isFixed } = req.body;

    if (!name || !description || !price || !image) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "Please provide all required fields"
            )
        );
    }

    let parsedPerHourDiscounts = {};
    if (perHourDiscounts) {
        try {
            parsedPerHourDiscounts = JSON.parse(perHourDiscounts);
        } catch (e) {
            return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid perHourDiscounts format"));
        }
    }


    if (isFixed && !perHourDiscounts) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "Please provide Discounts Rule"
            )
        );
    }

    if (isNaN(price) || price <= 0) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "Please provide a valid price"
            )
        );
    }

    const addOn = await AddOnModel.create({ name, description, price, image, perHourDiscounts: parsedPerHourDiscounts, isFixed });

    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Add-on created successfully",
        data: addOn,
    });
});

// update add-on
exports.updateAddOn = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const addOn = await AddOnModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!addOn) {
        return next(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID")
        );
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: addOn,
        message: "Add-on updated successfully",
    });
});

// delete add-on
exports.deleteAddOn = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const addOn = await AddOnModel.findByIdAndDelete(id);
    if (!addOn) {
        return next(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID")
        );
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: null,
        message: "Add-on deleted successfully",
    });
});
