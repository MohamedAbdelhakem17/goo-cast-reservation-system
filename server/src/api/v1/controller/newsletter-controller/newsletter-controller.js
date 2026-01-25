const asyncHandler = require("express-async-handler");

const AppError = require("../../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");
const NewsLettersModel = require("../../../../models/newsletter-model/newsletter-model");

// sIgnup function to handle user registration
exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate required fields
  if (!email) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Email fields are required");
  }

  const existing = await NewsLettersModel.findOne({ email });
  if (existing) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Already subscribed");
  }

  // Create new Subscription
  const newUser = await NewsLettersModel.create({ email });

  if (!newUser) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "failed to  subscribe");
  }

  return res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: "Subscribed successfully!",
  });
});
