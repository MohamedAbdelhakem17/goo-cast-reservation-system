const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const {
  uploadMultipleImages,
} = require("../../../../middleware/image-upload-middleware");
const AppError = require("../../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");
const StudioModel = require("../../../../models/studio-model/studio-model");
const BookingModel = require("../../../../models/booking-model/booking-model");

// studio image upload
exports.studioImageUpload = uploadMultipleImages([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "live_view",
    maxCount: 1,
  },
  {
    name: "imagesGallery",
    maxCount: 10,
  },
]);
// studio image upload Store
// exports.imageManipulation = async (req, res, next) => {
//     // upload Thumbnail
//     if (req.files.thumbnail) {
//         const thumbnailName = `studio-${uuidv4()}-${Date.now()}.jpeg`;
//         await sharp(req.files.thumbnail[0].buffer)
//             .resize(2000, 1333)
//             .toFormat("jpeg")
//             .jpeg({ quality: 90 })
//             .toFile(`uploads/studio/${thumbnailName}`);
//         req.body.thumbnail = thumbnailName;
//     } else if (req.body.thumbnailUrl) {
//         req.body.thumbnail = req.body.thumbnailUrl;
//     }

//     // upload imagesGallery
//     if (req.files.imagesGallery) {
//         const newImages = await Promise.all(
//             req.files.imagesGallery.map(async (file, index) => {
//                 const imageName = `studio-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
//                 await sharp(file.buffer)
//                     .resize(2000, 1333)
//                     .toFormat("jpeg")
//                     .jpeg({ quality: 90 })
//                     .toFile(`uploads/studio/${imageName}`);
//                 return imageName;
//             })
//         );

//         const existingImages = req.body.existingImages || [];

//         req.body.imagesGallery = [...existingImages, ...newImages];
//     } else if (req.body.existingImages) {
//         req.body.imagesGallery = req.body.existingImages;
//     }

//     next();
// };

exports.imageManipulation = async (req, res, next) => {
  try {
    const uploadDir = path.join(__dirname, "../../../uploads/studio");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Thumbnail
    if (req.files.thumbnail) {
      const thumbnailName = `studio-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.thumbnail[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${uploadDir}/${thumbnailName}`);
      req.body.thumbnail = thumbnailName;
    } else if (req.body.thumbnailUrl) {
      req.body.thumbnail = req.body.thumbnailUrl;
    }

    // live_view
    if (req.files.live_view) {
      const liveViewName = `studio-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.live_view[0].buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`${uploadDir}/${liveViewName}`);
      req.body.live_view = liveViewName;
    } else if (req.body.live_viewUrl) {
      req.body.live_view = req.body.live_viewUrl;
    }

    // Gallery
    if (req.files.imagesGallery) {
      const newImages = await Promise.all(
        req.files.imagesGallery.map(async (file, index) => {
          const imageName = `studio-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`${uploadDir}/${imageName}`);
          return imageName;
        }),
      );

      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [];

      req.body.imagesGallery = [...existingImages, ...newImages];
    } else if (req.body.existingImages) {
      req.body.imagesGallery = req.body.existingImages;
    }

    next();
  } catch (err) {
    console.error("Image processing failed:", err);
    res
      .status(500)
      .json({ message: "Image processing failed", error: err.message });
  }
};

// gat all studios
exports.getAllStudios = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const matchStage = {};
  if (status !== undefined) {
    matchStage.is_active = status === "true";
  }

  const studios = await StudioModel.aggregate([
    { $match: matchStage },

    // Join bookings
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "studio",
        as: "bookings",
      },
    },

    // Count last 30 days bookings
    {
      $addFields: {
        bookingsCount: {
          $size: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: {
                $gte: [
                  "$$booking.createdAt",
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                ],
              },
            },
          },
        },
      },
    },

    // Find max bookings
    {
      $setWindowFields: {
        output: {
          maxBookings: { $max: "$bookingsCount" },
        },
      },
    },

    // Flag most popular
    {
      $addFields: {
        isMostPopular: {
          $eq: ["$bookingsCount", "$maxBookings"],
        },
      },
    },

    // Cleanup
    {
      $project: {
        bookings: 0,
        maxBookings: 0,
      },
    },
  ]);

  if (!studios.length) {
    return res.status(404).json({
      status: HTTP_STATUS_TEXT.FAIL,
      message: "No studios found",
    });
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: studios,
  });
});

// get studio by id
exports.getStudioById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studio = await StudioModel.findOne(
    mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id },
  );
  if (!studio) {
    res.status(404).json({
      status: HTTP_STATUS_TEXT.FAIL,
      message: "Studio not found",
    });
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: studio,
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
    message: "Studio created successfully",
  });
});

// update a studio
exports.updateStudio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
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
    message: "Studio updated successfully",
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
    message: "Studio deleted successfully",
  });
});

exports.changePrice = asyncHandler(async (req, res) => {
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
    message: "Studio price updated successfully",
  });
});

exports.toggleStudioStatus = asyncHandler(async (req, res, next) => {
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

  const updatedStudio = await StudioModel.findByIdAndUpdate(
    id,
    { is_active },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedStudio) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No Studio found with this ID"),
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: updatedStudio,
    message: `Studio status updated to ${is_active ? "Active" : "Inactive"}`,
  });
});
