const asyncHandler = require("express-async-handler");
const HourlyPackageModel = require("../../models/hourly-packages-model/hourly-packages-model");
const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");

const fs = require("fs");
const path = require("path");

const {
  uploadSingleImage,
} = require("../../middleware/image-upload-middleware");

exports.serviceImageUpload = uploadSingleImage("image");

exports.serviceImageManipulation = async (req, res, next) => {
  try {
    const uploadDir = path.join(__dirname, "../../../uploads/services");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (req.files.image) {
      const serviceName = `service-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.image[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${uploadDir}/${serviceName}`);
      req.body.image = serviceName;
    } else if (req.body.imageUrl) {
      req.body.image = req.body.imageUrl;
    }

    next();
  } catch (err) {
    console.error("Image processing failed:", err);
    res
      .status(500)
      .json({ message: "Image processing failed", error: err.message });
  }
};

// get all hourly packages
exports.getAllHourlyPackages = asyncHandler(async (req, res, next) => {
  const hourlyPackages = await HourlyPackageModel.find();

  if (hourlyPackages.length === 0) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No hourly packages found")
    );
  }

  // const maxHours = 9;

  // const packagesWithPrices = await Promise.all(
  //     hourlyPackages.map(async (pkg) => {
  //         const prices = await calculatePackagePrices({ package: pkg, hours: maxHours });
  //         return {
  //             ...pkg._doc,
  //             hourlyPrices: prices
  //         };
  //     })
  // );

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: hourlyPackages,
  });
});

// create hourly package
exports.createHourlyPackage = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    details,
    category,
    post_session_benefits,
    target_audience,
  } = req.body;

  if (
    (!name || !description || !details,
    !category || !post_session_benefits || !target_audience)
  ) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "Please provide all required fields"
      )
    );
  }

  const hourlyPackage = await HourlyPackageModel.create({
    name,
    description,
    details,
    category,
    post_session_benefits,
    target_audience,
  });

  res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Hourly package created successfully",
    data: hourlyPackage,
  });
});

// update hourly package
exports.updateHourlyPackage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const hourlyPackage = await HourlyPackageModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!hourlyPackage) {
    return next(
      new AppError(
        404,
        HTTP_STATUS_TEXT.FAIL,
        "No hourly package found with this ID"
      )
    );
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
    return next(
      new AppError(
        404,
        HTTP_STATUS_TEXT.FAIL,
        "No hourly package found with this ID"
      )
    );
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: null,
    message: "hourly package deleted successfully",
  });
});

exports.packagePriceMange = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const hourlyPackage = await HourlyPackageModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!hourlyPackage) {
    return next(
      new AppError(
        404,
        HTTP_STATUS_TEXT.FAIL,
        "No hourly package found with this ID"
      )
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: hourlyPackage,
    message: "hourly package found successfully",
  });
});

exports.getHourlyPackagesByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.body;
  const hourlyPackage = await HourlyPackageModel.find({ category });
  if (!hourlyPackage) {
    return next(
      new AppError(
        404,
        HTTP_STATUS_TEXT.FAIL,
        "No hourly package found with this ID"
      )
    );
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: hourlyPackage,
    message: "hourly package found successfully",
  });
});
