const asyncHandler = require('express-async-handler');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

const PriceRuleModel = require('../../models/price-rule-model/price-rule-model');
const PackageModel = require('../../models/hourly-packages-model/hourly-packages-model');
const StudioModel = require('../../models/studio-model/studio-model');

// Helper function to check if dayOfWeek is valid
const isValidDayOfWeek = (day) => day === null || (day >= 0 && day <= 6);

// Get all price rules for one Studio
exports.getAllPriceRules = asyncHandler(async (req, res, next) => {
    const packageExist = await PackageModel.findById(req.params.id);

    if (!packageExist) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found"));
    }

    const priceRules = await PriceRuleModel.find({ package: req.params.id });

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
    const { rules } = req.body;

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Rules array is required"));
    }

    // Validate each rule
    for (const rule of rules) {
        const { package, dayOfWeek, defaultPricePerSlot, isFixedHourly, perSlotDiscounts } = rule;

        const isValidDay = isValidDayOfWeek(dayOfWeek);
        if (!package || defaultPricePerSlot === undefined || !isValidDay) {
            return next(
                new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid fields in rule")
            );
        }

        if (!isFixedHourly && !perSlotDiscounts) {
            return next(
                new AppError(400, HTTP_STATUS_TEXT.FAIL, "per Hour Discounts required when not fixed hourly")
            );
        }

        // Check for duplicates
        const exists = await PriceRuleModel.findOne({ package, dayOfWeek });
        if (exists) {
            return next(
                new AppError(400, HTTP_STATUS_TEXT.FAIL, `Price rule already exists for day ${dayOfWeek}`)
            );
        }
    }

    const inserted = await PriceRuleModel.insertMany(rules);

    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rules created successfully",
        data: inserted,
    });
});

// Edit Price Rule for one Studio
exports.editPriceRule = asyncHandler(async (req, res, next) => {
    const { package, dayOfWeek, isFixedHourly, defaultPricePerSlot, perSlotDiscounts } = req.body;

    console.log(req.body)
    const isValidDay = isValidDayOfWeek(dayOfWeek);
    if (!package || !isValidDay  || !defaultPricePerSlot) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields with a valid dayOfWeek (0-6 or null)"));
    }

    const packageExist = await PackageModel.findById(package);
    if (!packageExist) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found"));
    }

    const priceRule = await PriceRuleModel.findOneAndUpdate({ package, dayOfWeek }, { isFixedHourly, defaultPricePerSlot, perSlotDiscounts }, { new: true });

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
    const { id } = req.body;

    // if (!isValidDayOfWeek(dayOfWeek)) {
    //     return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide a valid dayOfWeek (0-6 or null)"));
    // }

    // const packageExist = await PackageModel.findById(package);
    // if (!packageExist) {
    //     return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found"));
    // }

    const priceRule = await PriceRuleModel.findByIdAndDelete(id);

    if (!priceRule) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"));
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Price Rule deleted successfully",
        data: null
    });
});
