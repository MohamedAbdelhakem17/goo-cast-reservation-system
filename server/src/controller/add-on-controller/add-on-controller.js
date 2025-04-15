const asyncHandler = require('express-async-handler');
const AddOnModel = require('../../models/add-on-model/add-on-model');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

// get all add-ons
exports.getAllAddOns = asyncHandler(async (req, res, next) => {
    const addOns = await AddOnModel.find();
    if (addOns.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-ons found"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: addOns
    });
});

// create add-on
exports.createAddOn = asyncHandler(async (req, res, next) => {
    const { name, description, price, icon } = req.body;
    if (!name || !description || !price) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields"));
    }
    const addOn = await AddOnModel.create({ name, description, price, icon });
    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Add-on created successfully",
        data: addOn
    });
});

// update add-on
exports.updateAddOn = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const addOn = await AddOnModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!addOn) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID"));
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
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: null,
        message: "Add-on deleted successfully",
    });
});


