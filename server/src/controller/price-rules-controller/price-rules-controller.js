const asyncHandler = require('express-async-handler');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

const PriceRuleModel = require('../../models/price-rule-model/price-rule-model');
const StudioModel = require('../../models/studio-model/studio-model');

// Helper function to check if dayOfWeek is valid
const isValidDayOfWeek = (day) => day === null || (day >= 0 && day <= 6);

// Get all price rules for one Studio
exports.getAllPriceRules = asyncHandler(async (req, res, next) => {
    const studioExists = await StudioModel.findById(req.params.id);
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceRules = await PriceRuleModel.find({ studio: req.params.id });

    if (priceRules.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No price rules found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: priceRules
    });
});

// Add New Price Rule for one Studio
exports.addNewPriceRule = asyncHandler(async (req, res, next) => {
    const { studio, dayOfWeek, isFixedHourly, defaultPricePerSlot, perSlotDiscounts } = req.body;

    console.log(req.body);
    console.log(isValidDayOfWeek(dayOfWeek));
    console.log(studio, "studio");
    console.log(isFixedHourly, "isFixedHourly");
    console.log(defaultPricePerSlot, "defaultPricePerSlot");
    console.log(perSlotDiscounts, "perSlotDiscounts");

    if (!studio || !isFixedHourly || !defaultPricePerSlot || !isValidDayOfWeek(dayOfWeek) || !perSlotDiscounts) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields with a valid dayOfWeek (0-6 or null)"));
    }

    const studioExists = await StudioModel.findById(studio);
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceRule = await PriceRuleModel.create({ studio, dayOfWeek, isFixedHourly, defaultPricePerSlot, perSlotDiscounts });

    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule created successfully",
        data: priceRule
    });
});

// Edit Price Rule for one Studio
exports.editPriceRule = asyncHandler(async (req, res, next) => {
    const { studio, dayOfWeek, isFixedHourly, defaultPricePerSlot, perSlotDiscounts } = req.body;

    if (!studio || !isValidDayOfWeek(dayOfWeek) || !isFixedHourly || !defaultPricePerSlot) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields with a valid dayOfWeek (0-6 or null)"));
    }

    const studioExists = await StudioModel.findById(studio);
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceRule = await PriceRuleModel.findOneAndUpdate({ studio, dayOfWeek }, { isFixedHourly, defaultPricePerSlot, perSlotDiscounts }, { new: true });

    if (!priceRule) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule updated successfully",
        data: priceRule
    });
});

// Delete Price Rule for one Studio
exports.deletePriceRule = asyncHandler(async (req, res, next) => {
    const { studio, dayOfWeek } = req.body;

    if (!isValidDayOfWeek(dayOfWeek)) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide a valid dayOfWeek (0-6 or null)"));
    }

    const studioExists = await StudioModel.findById(studio);
    if (!studioExists) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const priceRule = await PriceRuleModel.findOneAndDelete({ studio, dayOfWeek });

    if (!priceRule) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule deleted successfully",
        data: null
    });
});
