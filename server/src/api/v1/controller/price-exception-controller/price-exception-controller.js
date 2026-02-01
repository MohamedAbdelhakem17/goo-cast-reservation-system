const asyncHandler = require("express-async-handler");
const AppError = require("../../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");

const PriceExceptionModel = require("../../../../models/price-exception-model/price-exception-model");
const PackageModel = require("../../../../models/hourly-packages-model/hourly-packages-model");
const { getAllDay } = require("../../../../utils/time-mange");

// Get all price exceptions for one Package
exports.getAllPriceExceptions = asyncHandler(async (req, res, next) => {
  const packageExist = await PackageModel.findById(req.params.id);

  // Check if Package exists
  if (!packageExist) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "This Package not found"),
    );
  }

  const priceException = await PriceExceptionModel.find({
    package: req.params.id,
  });

  // Check if no price rules found
  if (priceException.length === 0) {
    res.status(200).json({
      status: HTTP_STATUS_TEXT.SUCCESS,
      message: "No price exceptions found",
      data: null,
    });
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: priceException,
  });
});

// Add New Price exception for one Package
exports.addNewPriceException = asyncHandler(async (req, res, next) => {
  const {
    package,
    date,
    isFixedHourly,
    defaultPricePerSlot,
    perSlotDiscounts,
  } = req.body;

  // Check if all required fields are provided
  if (!package || defaultPricePerSlot === undefined || isNaN(new Date(date))) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "Please provide all required fields with a valid Date",
      ),
    );
  }

  // check if isFixedHourly is false and validate perSlotDiscounts
  if (!isFixedHourly && !perSlotDiscounts) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "per Slot Discounts is required when is not Fixed Hourly",
      ),
    );
  }

  // Check if a price rule already exists for this studio and dayOfWeek
  const dateInput = getAllDay(date);
  const existingPriceException = await PriceExceptionModel.findOne({
    package,
    date: {
      $gte: dateInput.startOfDay,
      $lte: dateInput.endOfDay,
    },
  });

  // check if price exception already exists
  if (existingPriceException) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "A price Exception already exists for this Package and same date",
      ),
    );
  }

  // Check if studio exists
  const packageExist = await PackageModel.findById(package);
  if (!packageExist) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "this Package not found"),
    );
  }

  // Create new price rule
  const priceException = await PriceExceptionModel.create({
    package,
    date,
    isFixedHourly,
    defaultPricePerSlot,
    perSlotDiscounts,
  });
  res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Price Exception created successfully",
    data: priceException,
  });
});

// Edit Price Exception for one package
exports.editPriceException = asyncHandler(async (req, res, next) => {
  const {
    package,
    date,
    isFixedHourly,
    defaultPricePerSlot,
    perSlotDiscounts,
  } = req.body;

  // Check if all required fields are provided
  if (
    !package ||
    !isNaN(new Date(date)) ||
    !isFixedHourly ||
    !defaultPricePerSlot
  ) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "Please provide all required fields with a valid date",
      ),
    );
  }

  const packageExist = await StudioModel.findById(package);
  // Check if studio exists
  if (!packageExist) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package  not found"));
  }

  const exitDate = getAllDay(date);
  const existingPriceException = await PriceExceptionModel.findOne({
    package,
    date: {
      $gte: exitDate.startOfDay,
      $lte: exitDate.endOfDay,
    },
  });

  // check if price exception already exists
  if (existingPriceException) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "A price Exception already exists for this studio and same date",
      ),
    );
  }

  const priceRule = await PriceExceptionModel.findOneAndUpdate(
    { package, dayOfWeek },
    { isFixedHourly, defaultPricePerSlot, perSlotDiscounts },
    { new: true },
  );

  if (!priceRule) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"),
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Price Rule updated successfully",
    data: priceRule,
  });
});

// Delete Price Exception for one package
exports.deletePriceException = asyncHandler(async (req, res, next) => {
  const { package, date } = req.body;

  // Check if all required fields are provided
  if (isNaN(new Date(date))) {
    return next(
      new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide a valid date"),
    );
  }

  const packageExist = await PackageModel.findById(package);

  // Check if studio exists
  if (!packageExist) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found"));
  }

  const priceRule = await PriceExceptionModel.findOneAndDelete({
    package,
    date,
  });

  // Check if price rule exists
  if (!priceRule) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "Price Rule not found"),
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Price Rule deleted successfully",
    data: null,
  });
});
