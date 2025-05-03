const asyncHandler = require('express-async-handler');
const HourlyPackageModel = require('../../models/hourly-packages-model/hourly-packages-model');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

// get all Hourly Packages
exports.getAllHourlyPackages = asyncHandler(async (req, res, next) => {
    const hourlyPackage = await HourlyPackageModel.find();
    if (hourlyPackage.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No hourly packages found"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: hourlyPackage
    });
});

// create hourly package
exports.createHourlyPackage = asyncHandler(async (req, res, next) => {
    const { name, description, details, icon } = req.body;

    if (!name || !description || !details) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields"));
    }

    const hourlyPackage = await HourlyPackageModel.create({
        name,
        description,
        details,
        icon
    });

    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Hourly package created successfully",
        data: hourlyPackage
    });
});

// update hourly package
exports.updateHourlyPackage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const hourlyPackage = await HourlyPackageModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!hourlyPackage) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No hourly package found with this ID"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: hourlyPackage,
        message: "hourly package updated successfully",
    });
});

// delete hourly package
exports.deleteHourlyPackage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const hourlyPackage = await HourlyPackageModel.findByIdAndDelete(id);
    if (!hourlyPackage) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No hourly package found with this ID"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: null,
        message: "hourly package deleted successfully",
    });
});


