const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/category-model/category-model");

exports.getCategoryMinHour = asyncHandler(async (category_id) => {
  const category = await CategoryModel.findById(category_id);
  const minStartTime = category.minHours * 60;
  return minStartTime;
});
