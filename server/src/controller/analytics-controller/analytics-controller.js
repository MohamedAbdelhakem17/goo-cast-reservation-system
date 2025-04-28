const asyncHandler = require("express-async-handler");

const AppError = require("../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const AnalyticsModel = require("../../models/analytics-model/analytics-model");
const BookingModel = require("../../models/booking-model/booking-model");
const StudioModel = require("../../models/studio-model/studio-model");

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

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const totalStudios = await StudioModel.countDocuments();
    const totalBookings = await BookingModel.countDocuments();

    const revenue = await BookingModel.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    const mostBookedStudios = await BookingModel.aggregate([
        { $match: { studioId: { $ne: null } } },
        {
            $group: {
                _id: "$studioId",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "studios",
                localField: "_id",
                foreignField: "_id",
                as: "studio"
            }
        },
        { $unwind: "$studio" },
        {
            $project: {
                label: "$studio.name",
                count: 1,
                _id: 0
            }
        }
    ]);

    const mostBookedPackages = await BookingModel.aggregate([
        { $match: { packageId: { $ne: null } } },
        {
            $group: {
                _id: "$packageId",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "packages",
                localField: "_id",
                foreignField: "_id",
                as: "package"
            }
        },
        { $unwind: "$package" },
        {
            $project: {
                label: "$package.name",
                count: 1,
                _id: 0
            }
        }
    ]);

    const mostBookedAddOns = await BookingModel.aggregate([
        { $unwind: "$addOnId" },
        { $match: { addOnId: { $ne: null } } },
        {
            $group: {
                _id: "$addOnId",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "addons",
                localField: "_id",
                foreignField: "_id",
                as: "addOn"
            }
        },
        { $unwind: "$addOn" },
        {
            $project: {
                label: "$addOn.name",
                count: 1,
                _id: 0
            }
        }
    ]);

    const mostBookedDay = await BookingModel.aggregate([
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }, // علشان الرسمة تكون مرتبة حسب الوقت
        {
            $project: {
                label: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
                count: 1,
                _id: 0
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            totalStudios,
            totalBookings,
            totalRevenue,
            mostBookedStudios: [
                { label: "Studio A", count: 8 },
                { label: "Studio B", count: 7 },
                { label: "Studio C", count: 5 }
            ],
            mostBookedPackages: [
                { label: "Go-Social", count: 12 },
                { label: "Pro-Cast", count: 8 },
                { label: "Basic", count: 3 }
            ],
            mostBookedAddOns: [
                { label: "Extra Microphone", count: 15 },
                { label: "Video Editing", count: 10 },
                { label: "Thumbnail Design", count: 5 }
            ],
            mostBookedDay
        }
    });
});

