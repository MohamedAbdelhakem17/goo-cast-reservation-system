const asyncHandler = require('express-async-handler');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

const PriceExceptionModel = require('../../models/price-exception-model/price-exception-model');
const StudioModel = require('../../models/studio-model/studio-model');
const { getAllDay } = require('../../utils/time-mange');


// Get all price exceptions for one Studio
exports.getAllPriceExceptions = asyncHandler(async (req, res, next) => {
    const studioExists = await StudioModel.findById(req.params.id);

    // Check if studio exists
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceException = await PriceExceptionModel.find({ studio: req.params.id });

    // Check if no price rules found
    if (priceException.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No price rules found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: priceException
    });
});

// Add New Price exception for one Studio
exports.addNewPriceException = asyncHandler(async (req, res, next) => {
    const { studio, date, isFixedHourly, defaultPricePerSlot, perSlotDiscounts } = req.body;

    // Check if all required fields are provided
    if (!studio || defaultPricePerSlot === undefined || isNaN(new Date(date))) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "Please provide all required fields with a valid Date"
            )
        );
    }

    // check if perSlotDiscounts is an array
    if (!isFixedHourly && (!perSlotDiscounts || !Array.isArray(perSlotDiscounts) || perSlotDiscounts.length === 0)) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "per Slot Discounts is required when is not Fixed Hourly "
            )
        );
    }

    // Check if a price rule already exists for this studio and dayOfWeek
    const dateInput = getAllDay(date)
    const existingPriceException = await PriceExceptionModel.findOne({
        studio,
        date: {
            $gte: dateInput.startOfDay,
            $lte: dateInput.endOfDay
        }
    });

    // check if price exception already exists
    if (existingPriceException) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "A price Exception already exists for this studio and same date"
            )
        );
    }

    // Check if studio exists
    const studioExists = await StudioModel.findById(studio);
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    // Create new price rule
    const priceException = await PriceExceptionModel.create({ studio, date, isFixedHourly, defaultPricePerSlot, perSlotDiscounts });
    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Exception created successfully",
        data: priceException
    });
});

// Edit Price Exception for one Studio
exports.editPriceException = asyncHandler(async (req, res, next) => {
    const { studio, date, isFixedHourly, defaultPricePerSlot, perSlotDiscounts } = req.body;

    // Check if all required fields are provided
    if (!studio || !isNaN(new Date(date)) || !isFixedHourly || !defaultPricePerSlot) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields with a valid date"));
    }

    const studioExists = await StudioModel.findById(studio);
    // Check if studio exists
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const exitDate = getAllDay(date)
    const existingPriceException = await PriceExceptionModel.findOne({
        studio,
        date: {
            $gte: exitDate.startOfDay,
            $lte: exitDate.endOfDay
        }
    });

    // check if price exception already exists
    if (existingPriceException) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "A price Exception already exists for this studio and same date"
            )
        );
    }

    const priceRule = await PriceExceptionModel.findOneAndUpdate({ studio, dayOfWeek }, { isFixedHourly, defaultPricePerSlot, perSlotDiscounts }, { new: true });

    if (!priceRule) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule updated successfully",
        data: priceRule
    });
});

// Delete Price Exception for one Studio
exports.deletePriceException = asyncHandler(async (req, res, next) => {
    const { studio, date } = req.body;

    // Check if all required fields are provided
    if (isNaN(new Date(date))) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide a valid date"));
    }

    const studioExists = await StudioModel.findById(studio);

    // Check if studio exists
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceRule = await PriceExceptionModel.findOneAndDelete({ studio, dayOfWeek });

    // Check if price rule exists
    if (!priceRule) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule deleted successfully",
        data: null
    });
});
