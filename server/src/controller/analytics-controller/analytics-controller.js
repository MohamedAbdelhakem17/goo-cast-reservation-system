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

    const mostBookedUser = await BookingModel.aggregate([
        {
            $match: {
                "personalInfo.email": { $ne: null }
            }
        },
        {
            $group: {
                _id: "$personalInfo.email",
                totalBookings: { $sum: 1 },
                personalInfo: { $first: "$personalInfo" },
                studios: { $push: "$studio" },
                packages: { $push: "$package.id" },
                addOns: { $push: "$addOns.item" }
            }
        },
        { $sort: { totalBookings: -1 } },
        { $limit: 1 },

        {
            $project: {
                personalInfo: 1,
                totalBookings: 1,
                studios: 1,
                packages: 1,
                addOns: {
                    $reduce: {
                        input: "$addOns",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] }
                    }
                }
            }
        },

        { $unwind: "$studios" },
        {
            $group: {
                _id: {
                    email: "$personalInfo.email",
                    studio: "$studios"
                },
                personalInfo: { $first: "$personalInfo" },
                totalBookings: { $first: "$totalBookings" },
                packages: { $first: "$packages" },
                addOns: { $first: "$addOns" },
                studioCount: { $sum: 1 }
            }
        },
        { $sort: { studioCount: -1 } },
        { $limit: 1 },

        {
            $lookup: {
                from: "studios",
                localField: "_id.studio",
                foreignField: "_id",
                as: "studio"
            }
        },
        { $unwind: "$studio" },

        { $unwind: { path: "$packages", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: {
                    email: "$_id.email",
                    package: "$packages"
                },
                personalInfo: { $first: "$personalInfo" },
                totalBookings: { $first: "$totalBookings" },
                studio: { $first: "$studio" },
                studioBookings: { $first: "$studioCount" },
                addOns: { $first: "$addOns" },
                packageCount: { $sum: 1 }
            }
        },
        { $sort: { packageCount: -1 } },
        { $limit: 1 },

        {
            $lookup: {
                from: "hourlypackages",
                localField: "_id.package",
                foreignField: "_id",
                as: "package"
            }
        },
        { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },

        { $unwind: { path: "$addOns", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: {
                    email: "$_id.email",
                    addOn: "$addOns"
                },
                personalInfo: { $first: "$personalInfo" },
                totalBookings: { $first: "$totalBookings" },
                studio: { $first: "$studio" },
                studioBookings: { $first: "$studioBookings" },
                package: { $first: "$package" },
                packageBookings: { $first: "$packageCount" },
                addOnCount: { $sum: 1 }
            }
        },
        { $sort: { addOnCount: -1 } },
        { $limit: 1 },

        {
            $lookup: {
                from: "addons",
                localField: "_id.addOn",
                foreignField: "_id",
                as: "addOn"
            }
        },
        { $unwind: { path: "$addOn", preserveNullAndEmptyArrays: true } },

        {
            $project: {
                _id: 0,
                personalInfo: 1,
                totalBookings: 1,
                mostBookedStudio: "$studio.name",
                studioBookings: "$studioBookings",
                mostBookedPackage: "$package.name",
                packageBookings: "$packageBookings",
                mostBookedAddOn: "$addOn.name",
                addOnBookings: "$addOnCount"
            }
        }
    ]);

    const mostBookedStudios = await BookingModel.aggregate([
        { $match: { studio: { $ne: null } } },
        {
            $group: {
                _id: "$studio",
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
        { $match: { "package.id": { $ne: null } } },
        {
            $group: {
                _id: "$package.id",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "hourlypackages",
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
        { $unwind: "$addOns" },
        { $match: { "addOns.item": { $ne: null } } },
        {
            $group: {
                _id: "$addOns.item",
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
        { $sort: { _id: 1 } },
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
            mostBookedStudios,
            mostBookedPackages,
            mostBookedAddOns,
            mostBookedDay,
            mostBookedUser
        }
    });
});

