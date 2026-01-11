const asyncHandler = require("express-async-handler");

const AppError = require("../../utils/app-error");

const {
  HTTP_STATUS_TEXT,
  BOOKING_PIPELINE,
} = require("../../config/system-variables");

const AnalyticsModel = require("../../models/analytics-model/analytics-model");
const BookingModel = require("../../models/booking-model/booking-model");

// add analytics
exports.addAnalytics = asyncHandler(async (req, res, next) => {
  const { prevPath: page, timeSpent: timeSpent, timestamp } = req.body;
  if (!page || !timeSpent) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "Please provide all required fields"
      )
    );
  }
  const analytics = await AnalyticsModel.create({ page, timeSpent, timestamp });
  res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Analytics created successfully",
    data: analytics,
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
        averageTime: { $avg: "$timeSpent" },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
  ]);

  analytics.forEach((stat) => {
    stat.averageTime = (stat.averageTime / 60).toFixed(2);
    stat.totalSpent = (stat.totalSpent / 60).toFixed(2);
  });

  if (analytics.length === 0) {
    res.status(404).json({
      status: HTTP_STATUS_TEXT.FAIL,
      message: "No analytics found",
    });
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: analytics,
  });
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  // ===================== 📊 Basic Stats =====================
  const totalBookings = await BookingModel.countDocuments();

  const prevMonthBookings = await BookingModel.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  // 💰 Revenue
  const totalRevenueResult = await BookingModel.aggregate([
    { $match: { status: BOOKING_PIPELINE.COMPLETED } },
    { $group: { _id: null, total: { $sum: "$totalPriceAfterDiscount" } } },
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const prevRevenueResult = await BookingModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1
          ),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalPriceAfterDiscount" } } },
  ]);
  const prevRevenue = prevRevenueResult[0]?.total || 0;

  // 📈 Growth %
  const totalBookingsGrowth =
    prevMonthBookings === 0
      ? 0
      : (
          ((totalBookings - prevMonthBookings) / prevMonthBookings) *
          100
        ).toFixed(1);

  const totalRevenueGrowth =
    prevRevenue === 0
      ? 0
      : (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1);

  // ===================== 🏆 Top Service =====================
  const topServiceAgg = await BookingModel.aggregate([
    { $match: { package: { $ne: null } } },
    { $group: { _id: "$package", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "hourlypackages",
        localField: "_id",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        count: 1,
        name: {
          en: { $ifNull: ["$service.name.en", "Unknown Service"] },
          ar: { $ifNull: ["$service.name.ar", "خدمة غير معروفة"] },
        },
      },
    },
  ]);

  const topService =
    topServiceAgg[0] && totalBookings > 0
      ? {
          name: topServiceAgg[0].name,
          percentage: ((topServiceAgg[0].count / totalBookings) * 100).toFixed(
            1
          ),
        }
      : null;

  // ===================== 🏢 Top Studio =====================
  const topStudioAgg = await BookingModel.aggregate([
    { $group: { _id: "$studio", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "studios",
        localField: "_id",
        foreignField: "_id",
        as: "studio",
      },
    },
    { $unwind: "$studio" },
    {
      $project: {
        name: {
          en: { $ifNull: ["$studio.name.en", "Unknown Studio"] },
          ar: { $ifNull: ["$studio.name.ar", "استوديو غير معروف"] },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  const topStudio =
    topStudioAgg[0] && totalBookings > 0
      ? {
          name: topStudioAgg[0].name,
          percentage: ((topStudioAgg[0].count / totalBookings) * 100).toFixed(
            1
          ),
        }
      : null;

  // ===================== ⏰ Peak Booking Hours =====================
  const peakBookingHours = await BookingModel.aggregate([
    { $group: { _id: "$startSlot", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { hour: "$_id", count: 1, _id: 0 } },
  ]);

  // ===================== 📦 Service Distribution (Top 3) =====================
  let serviceDistributionRaw = await BookingModel.aggregate([
    { $match: { package: { $ne: null } } },
    { $group: { _id: "$package", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $lookup: {
        from: "hourlypackages",
        localField: "_id",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        label: {
          en: { $ifNull: ["$service.name.en", "Unknown Service"] },
          ar: { $ifNull: ["$service.name.ar", "خدمة غير معروفة"] },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  const totalServiceCount = serviceDistributionRaw.reduce(
    (acc, s) => acc + s.count,
    0
  );

  // Get top 3 services
  const top3Services = serviceDistributionRaw.slice(0, 3);

  // Calculate "Others" if more than 3 services exist
  let serviceDistribution = top3Services.map((s) => ({
    label: s.label,
    count: s.count,
    percentage:
      totalServiceCount > 0
        ? ((s.count / totalServiceCount) * 100).toFixed(1)
        : 0,
  }));

  // Add "Others" category if there are more than 3 services
  if (serviceDistributionRaw.length > 3) {
    const othersCount = serviceDistributionRaw
      .slice(3)
      .reduce((acc, s) => acc + s.count, 0);

    serviceDistribution.push({
      label: { en: "Others", ar: "خدمات أخرى" },
      count: othersCount,
      percentage:
        totalServiceCount > 0
          ? ((othersCount / totalServiceCount) * 100).toFixed(1)
          : 0,
    });
  }

  // ===================== ➕ AddOns Distribution =====================
  let addonsDistribution = await BookingModel.aggregate([
    { $unwind: "$addOns" },
    { $group: { _id: "$addOns.item", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $lookup: {
        from: "addons",
        localField: "_id",
        foreignField: "_id",
        as: "addon",
      },
    },
    { $unwind: "$addon" },
    {
      $project: {
        label: {
          en: { $ifNull: ["$addon.name.en", "Unknown AddOn"] },
          ar: { $ifNull: ["$addon.name.ar", "إضافة غير معروفة"] },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  const totalAddonsCount = addonsDistribution.reduce(
    (acc, a) => acc + a.count,
    0
  );

  addonsDistribution = addonsDistribution.map((a) => ({
    ...a,
    percentage:
      totalAddonsCount > 0
        ? ((a.count / totalAddonsCount) * 100).toFixed(1)
        : 0,
  }));

  // ===================== 📅 Revenue Trends =====================
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueTrendsRaw = await BookingModel.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: { $sum: "$totalPriceAfterDiscount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenueTrends = revenueTrendsRaw.map((item) => ({
    month: monthNames[item._id - 1],
    totalRevenue: item.totalRevenue,
  }));

  // ===================== 📌 Upcoming Bookings =====================
  const upcomingBookings = await BookingModel.aggregate([
    { $match: { date: { $gte: new Date() } } },
    { $sort: { date: 1, startSlotMinutes: 1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "studios",
        localField: "studio",
        foreignField: "_id",
        as: "studioData",
      },
    },
    { $unwind: "$studioData" },
    {
      $lookup: {
        from: "hourlypackages",
        localField: "package",
        foreignField: "_id",
        as: "packageData",
      },
    },
    { $unwind: "$packageData" },
    {
      $project: {
        customer: "$personalInfo.fullName",
        service: {
          en: { $ifNull: ["$packageData.name.en", "Unknown Service"] },
          ar: { $ifNull: ["$packageData.name.ar", "خدمة غير معروفة"] },
        },
        studio: {
          en: { $ifNull: ["$studioData.name.en", "Unknown Studio"] },
          ar: { $ifNull: ["$studioData.name.ar", "استوديو غير معروف"] },
        },
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        time: "$startSlot",
      },
    },
  ]);

  // ===================== ✅ Response =====================
  res.json({
    status: "success",
    data: {
      totalBookings: {
        value: totalBookings,
        growth: parseFloat(totalBookingsGrowth),
      },
      totalRevenue: {
        value: totalRevenue,
        growth: parseFloat(totalRevenueGrowth),
      },
      topService,
      topStudio,
      peakBookingHours,
      serviceDistribution,
      addonsDistribution,
      revenueTrends,
      upcomingBookings,
    },
  });
});
