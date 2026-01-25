const asyncHandler = require("express-async-handler");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const AppError = require("../../utils/app-error");
const userProfileModel = require("../../models/user-profile-model/user-profile-model");

/**
 * GET all user profiles
 */
exports.getAllUsersProfiles = asyncHandler(async (req, res) => {
  const profiles = await userProfileModel.find().select("-password -__v");

  return res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: profiles,
  });
});

/**
 * GET single user profile by email or phone
 * Query Params: email, phone
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.ERROR,
      "User ID is required to fetch user profile"
    );
  }

  const userProfile = await userProfileModel.findById(id).select("-__v");

  if (!userProfile) {
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.ERROR,
      "No user profile found for the provided ID"
    );
  }

  return res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: userProfile,
  });
});
