const asyncHandler = require('express-async-handler');
const CategoryModel = require('../../models/category-model/category-model');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');

// get all categories
exports.getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await CategoryModel.find();
    if (categories.length === 0) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No categories found"));
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: categories,
    });
});

// add category
exports.addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(
            new AppError(
                400,
                HTTP_STATUS_TEXT.FAIL,
                "Please provide all required fields"
            )
        );
    }
    const category = await CategoryModel.create(req.body);
    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: category,
        message: "Category added successfully",
    });
});

// update category
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        return next(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "No category found with this ID")
        );
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: category,
        message: "Category updated successfully",
    });
});


// delete category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
        return next(
            new AppError(404, HTTP_STATUS_TEXT.FAIL, "No category found with this ID")
        );
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: null,
        message: "Category deleted successfully",
    });
});