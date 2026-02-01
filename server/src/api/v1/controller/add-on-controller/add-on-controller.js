const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const AppError = require("../../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");
const {
  uploadSingleImage,
} = require("../../../../middleware/image-upload-middleware");
const AddOnModel = require("../../../../models/add-on-model/add-on-model");

exports.addonsImageUpload = uploadSingleImage("image");

exports.addonsImageManipulation = asyncHandler(async (req, res, next) => {
  if (req.body.imageUrl) return next();

  if (!req.file) {
    return next(
      new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please upload an image"),
    );
  }

  const imageName = `addons-${uuidv4()}-${Date.now()}.gif`;
  const filePath = path.join(
    __dirname,
    "../../../../../uploads/addons",
    imageName,
  );
  fs.writeFileSync(filePath, req.file.buffer);

  req.body.image = imageName;
  next();
});

// get all add-ons
exports.getAllAddOns = asyncHandler(async (req, res, next) => {
  const { status } = req.query;

  let filter = {};
  if (status !== undefined) {
    filter.is_active = status === "true";
  }

  const addOns = await AddOnModel.find(filter).sort({ name: 1 });

  if (addOns.length === 0) {
    return res.status(200).json({
      status: HTTP_STATUS_TEXT.SUCCESS,
      data: addOns,
    });
  }

  return res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: addOns,
  });
});

// get single addon
exports.getAddOnById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const addOn = await AddOnModel.findById(id);

  if (!addOn) {
    return res.status(404).json({
      status: HTTP_STATUS_TEXT.FAIL,
      message: "Add-on not found",
    });
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: addOn,
  });
});

exports.createAddOn = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, perHourDiscounts, isFixed } =
    req.body;

  if (!name || !description || !price || !image) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "Please provide all required fields",
      ),
    );
  }

  let parsedPerHourDiscounts = {};
  if (perHourDiscounts) {
    try {
      parsedPerHourDiscounts = JSON.parse(perHourDiscounts);
    } catch (e) {
      return next(
        new AppError(
          400,
          HTTP_STATUS_TEXT.FAIL,
          "Invalid perHourDiscounts format",
        ),
      );
    }
  }

  if (isFixed && !perHourDiscounts) {
    return next(
      new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide Discounts Rule"),
    );
  }

  if (isNaN(price) || price <= 0) {
    return next(
      new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide a valid price"),
    );
  }

  const addOn = await AddOnModel.create({
    name,
    description,
    price,
    image,
    perHourDiscounts: parsedPerHourDiscounts,
    isFixed,
  });

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
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID"),
    );
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: addOn,
    message: "Add-on updated successfully",
  });
});

exports.toggleAddOnStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active !== "boolean") {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "`is_active` must be a boolean.",
      ),
    );
  }

  const updatedAddOn = await AddOnModel.findByIdAndUpdate(
    id,
    { is_active },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedAddOn) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID"),
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: updatedAddOn,
    message: `Add-on status updated to ${is_active ? "Active" : "Inactive"}`,
  });
});

// delete add-on
exports.deleteAddOn = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const addOn = await AddOnModel.findByIdAndDelete(id);
  if (!addOn) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No add-on found with this ID"),
    );
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: null,
    message: "Add-on deleted successfully",
  });
});
