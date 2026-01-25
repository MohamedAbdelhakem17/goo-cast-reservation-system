const addMostPopularFlag = (matchStage = {}) => [
  { $match: matchStage },

  // Join bookings
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "studio",
      as: "bookings",
    },
  },

  // Count last 30 days bookings
  {
    $addFields: {
      bookingsCount: {
        $size: {
          $filter: {
            input: "$bookings",
            as: "booking",
            cond: {
              $gte: [
                "$$booking.createdAt",
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              ],
            },
          },
        },
      },
    },
  },

  // Find max bookings
  {
    $setWindowFields: {
      output: {
        maxBookings: { $max: "$bookingsCount" },
      },
    },
  },

  // Flag most popular
  {
    $addFields: {
      isMostPopular: { $eq: ["$bookingsCount", "$maxBookings"] },
    },
  },

  // Cleanup
  {
    $project: {
      bookings: 0,
      maxBookings: 0,
    },
  },
];

module.exports = addMostPopularFlag;
