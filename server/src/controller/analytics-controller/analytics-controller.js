const asyncHandler = require("express-async-handler");

const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const AnalyticsModel = require("../../models/analytics-model/analytics-model");


// add analytics
exports.addAnalytics = asyncHandler(async (req, res, next) => {
    const { prevPath: page, timeSpent: timeSpent, timestamp } = req.body;
    if (!page || !timeSpent) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Please provide all required fields"));
    }
    const analytics = await AnalyticsModel.create({ page, timeSpent, timestamp });
    res.status(201).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Analytics created successfully",
        data: analytics
    });
});

// get analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
    const analytics = await AnalyticsModel.aggregate([
        {
            $group: {
                _id: "$page",
                totalSpent: { $sum: "$timeSpent" },
                visitsCount: { $sum: 1 },
                averageTime: { $avg: "$timeSpent" }
            },

        },
        {
            $sort: { totalSpent: -1 }
        }
    ]);

    analytics.forEach(stat => {
        stat.averageTime = (stat.averageTime / 60).toFixed(2); 
        stat.totalSpent = (stat.totalSpent / 60).toFixed(2);
    });

    if (analytics.length === 0) {
        res.status(404).json({
            status: HTTP_STATUS_TEXT.FAIL,
            message: "No analytics found"
        })
    }
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: analytics,
    });
});
