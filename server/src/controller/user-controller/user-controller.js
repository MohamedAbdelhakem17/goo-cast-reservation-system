const asyncHandler = require("express-async-handler");

const AppError = require("../../utils/app-error");
const { getAllDay } = require("../../utils/time-mange");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const AuthModel = require("../../models/user-model/user-model");
const BookingModel = require("../../models/booking-model/booking-model");

// Get User Data
exports.getUserData = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const userData = await AuthModel.findById(_id, {
    email: 1,
    name: 1,
    phone: 1,
  });
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: userData,
  });
});

// Edit User Data
exports.updateUserData = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { name, phone } = req.body;


  const updateFields = { name, phone };
  const userData = await AuthModel.findByIdAndUpdate(_id, updateFields, {
    new: true,
  });

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "User data updated successfully",
    data: userData,
  });
});

// Edit Login User Password
exports.editLoginUserPassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { password, confirmPassword, currentPassword } = req.body;

  const user = await AuthModel.findById(_id);
  const isCorrectPassword = await user.comparePassword(currentPassword);

  if (!isCorrectPassword) {
    throw new AppError(
      401,
      HTTP_STATUS_TEXT.FAIL,
      "Invalid credentials please try again and check your current password"
    );
  }

  if (!password || !confirmPassword) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
  }

  if (password !== confirmPassword) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
  }

  user.password = password;

  await user.save();
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Password updated successfully",
    data: user,
  });
});

// Get User Stats
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { startOfDay } = getAllDay(new Date());

  // 1. Find the last booking before today
  const lastBookingBeforeToday = await BookingModel.find({
    createdBy: _id,
    status: "approved",
    date: { $lt: startOfDay },
  })
    .sort({ date: -1 })
    .limit(1)
    .populate("studio")
    .populate("package"); // Populate studio and package

  // 2. Find the next booking after today
  const nextBookingAfterToday = await BookingModel.find({
    createdBy: _id,
    status: "approved",
    date: { $gt: startOfDay },
  })
    .sort({ date: 1 })
    .limit(1)
    .populate("studio")
    .populate("package"); // Populate studio and package

  // 3. Find the most booked studio
  const mostStudioBooked = await BookingModel.aggregate([
    { $match: { createdBy: _id, status: "approved" } },
    { $group: { _id: "$studio", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  // If we found the most booked studio, get the studio details (populate)
  let studioDetails = null;
  if (mostStudioBooked.length > 0) {
    studioDetails = await BookingModel.findOne({
      studio: mostStudioBooked[0]._id,
    }).populate("studio");
  }

  // 4. Find the most booked package
  const mostPackageBooked = await BookingModel.aggregate([
    { $match: { createdBy: _id, status: "approved" } },
    { $group: { _id: "$package", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  // If we found the most booked package, get the package details (populate)
  let packageDetails = null;
  if (mostPackageBooked.length > 0) {
    packageDetails = await BookingModel.findOne({
      package: mostPackageBooked[0]._id,
    }).populate("package");
  }

  const print = (val, lab) => {
    console.log("===============", lab, " ================");
    console.log(val);
    console.log("=========================================");
  };

  print(mostStudioBooked, "mostStudioBooked");

  // Return the data
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: {
      lastBookingBeforeToday: {
        studioName: lastBookingBeforeToday[0]?.studio?.name,
        packageName: lastBookingBeforeToday[0]?.package?.name, 
        bookingDate: lastBookingBeforeToday[0]?.date,
        price: nextBookingAfterToday[0]?.totalPrice,
      },
      nextBookingAfterToday: {
        studioName: nextBookingAfterToday[0]?.studio?.name,
        packageName: nextBookingAfterToday[0]?.package?.name, 
        bookingDate: nextBookingAfterToday[0]?.date,
        price: nextBookingAfterToday[0]?.totalPrice,
      },

      mostStudioBooked: {
        studioName: studioDetails?.studio?.name, 
        count: mostStudioBooked[0]?.count,
      },

      mostPackageBooked: {
        packageName: packageDetails?.package?.name,
        packageCategory: packageDetails?.package?.category?.name,
        count: mostPackageBooked[0]?.count,
      },
    },
  });
});
