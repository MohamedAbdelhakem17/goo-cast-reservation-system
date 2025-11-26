const asyncHandler = require("express-async-handler");
const AuthModel = require("../../models/user-model/user-model");
const { USER_ROLE } = require("../../config/system-variables");
const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");

// Get all admins
exports.getAllAdmins = asyncHandler(async (req, res, next) => {
  const admins = await AuthModel.find({
    role: { $in: [USER_ROLE.ADMIN, USER_ROLE.MANAGER] },
  }).select(["name", "email", "active", "role"]);

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: admins,
  });
});

// Create new Admin
exports.createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword || !role) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
  }

  // Check if user already exists
  const existingUser = await AuthModel.findOne({ email });

  if (existingUser) {
    throw new AppError(409, HTTP_STATUS_TEXT.FAIL, "User already exists");
  }

  // Create new user
  const newUser = await AuthModel.create({
    name,
    email,
    password,
    active: true,
    role: role,
  });

  if (!newUser) {
    throw new AppError(409, HTTP_STATUS_TEXT.FAIL, "User already exists");
  }

  return res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: "Admin created successfully. ",
  });
});

// Toggle admin status
exports.toggleStudioStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return next(
      new AppError(400, HTTP_STATUS_TEXT.FAIL, "`status` must be a boolean.")
    );
  }

  const updatedAdmin = await AuthModel.findByIdAndUpdate(
    id,
    { active },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAdmin) {
    return next(
      new AppError(404, HTTP_STATUS_TEXT.FAIL, "No Admin found with this ID")
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: updatedAdmin,
    message: `Admin status updated to ${active ? "Active" : "Inactive"}`,
  });
});
