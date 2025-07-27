const asyncHandler = require("express-async-handler");

const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");

const FaqModel = require("../../models/faq-model/faq-model");

exports.getAllFaqs = asyncHandler(async (req, res, next) => {
  const faqs = await FaqModel.find();
  res.status(200).json({
    status: "success",
    data: [...faqs]
    ,
  });
});

exports.createFaq = asyncHandler(async (req, res, next) => {
  const { question, answer } = req.body;

  const newFaq = await FaqModel.create({
    question,
    answer,
  });

  res.status(201).json({
    status: "success",
    data: {
      faq: newFaq,
    },
  });
});
exports.updateFaq = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  const updatedFaq = await FaqModel.findByIdAndUpdate(
    id,
    { question, answer },
    { new: true, runValidators: true }
  );

  if (!updatedFaq) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "FAQ not found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      faq: updatedFaq,
    },
  });
});

exports.deleteFaq = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedFaq = await FaqModel.findByIdAndDelete(id);

  if (!deletedFaq) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "FAQ not found"));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
