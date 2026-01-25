const asyncHandler = require("express-async-handler");
const StudioModel = require("../../../../models/studio-model/studio-model");
const BookingModel = require("../../../../models/booking-model/booking-model");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");
const AppError = require("../../../../utils/app-error");
const { getAllDay, timeToMinutes } = require("../../../../utils/time-mange");
const addMostPopularFlag = require("../../../../utils/add-popular-studio");

/**
 * Get studios with availability status for a specific date and time slot
 * @route GET /api/v2/bookings/available-studios
 * @param {string} req.query.date - Date in YYYY-MM-DD format
 * @param {string} req.query.startSlot - Start time in HH:mm format
 * @param {number} [req.query.duration=1] - Duration in hours
 * @returns {Object} Studios array with isBooked flag
 */
exports.getStudiosAvailability = asyncHandler(async (req, res) => {
  // Extract query parameters
  const { date, startSlot, duration } = req.query;

  // Basic validation
  if (!date || !startSlot) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "date and startSlot required",
    );
  }

  // Calculate required duration in minutes
  const requiredDurationMinutes = (Number(duration) || 1) * 60;

  // Get start and end of the day
  const { startOfDay, endOfDay } = getAllDay(date);

  // Convert startSlot to minutes and calculate endSlot in minutes
  const startSlotMinutes = timeToMinutes(startSlot);
  const endSlotMinutes = startSlotMinutes + requiredDurationMinutes;

  // Find booked studios for the given date and time range
  const bookedStudios = await BookingModel.distinct("studio", {
    date: { $gte: startOfDay, $lt: endOfDay },
    $expr: {
      $and: [
        { $lt: ["$startSlotMinutes", endSlotMinutes] },
        { $gt: ["$endSlotMinutes", startSlotMinutes] },
      ],
    },
  });

  const studios = await StudioModel.aggregate(
    addMostPopularFlag({ is_active: true }),
  );

  const bookedSet = new Set(bookedStudios.map(String));

  const result = studios.map((studio) => ({
    ...studio,
    is_available: /**bookedSet.has(studio._id.toString())**/ true,
  }));

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: result,
  });
});

// exports.getStudiosAvailability = asyncHandler(async (req, res) => {
//   const { date, startSlot, duration } = req.query;

//   if (!date || !startSlot) {
//     throw new AppError(
//       400,
//       HTTP_STATUS_TEXT.FAIL,
//       "date and startSlot are required",
//     );
//   }

//   const requiredDurationMinutes = (Number(duration) || 1) * 60;

//   const studios = await StudioModel.find({ status: "active" }).lean();

//   const { startOfDay, endOfDay } = getAllDay(date);

//   const startSlotMinutes = timeToMinutes(startSlot);
//   const endSlotMinutes = startSlotMinutes + requiredDurationMinutes;

//   const bookings = await BookingModel.find({
//     date: { $gte: startOfDay, $lt: endOfDay },
//   }).select("studio startSlotMinutes endSlotMinutes startSlot endSlot");
//   // .lean();

//   console.log("Studios availability bookings:", bookings);

//   const result = studios.map((studio) => {
//     const studioBookings = bookings.filter(
//       (booking) => booking.studio.toString() === studio._id.toString(),
//     );

//     console.log("Studios availability studioBookings:", studioBookings);

//     const isBooked = studioBookings.some((booking) => {
//       const bookingStart =
//         booking.startSlotMinutes || timeToMinutes(booking.startSlot);
//       const bookingEnd =
//         booking.endSlotMinutes || timeToMinutes(booking.endSlot);

//       return bookingStart < endSlotMinutes && bookingEnd > startSlotMinutes;
//     });

//     return {
//       ...studio,
//       isBooked,
//     };
//   });

//   console.log("Studios availability result:", result);
//   res.status(200).json({
//     status: HTTP_STATUS_TEXT.SUCCESS,
//     data: result,
//   });
// });

// exports.getStudiosAvailability = asyncHandler(async (req, res, next) => {
//   // Extract query parameters
//   const { date, startSlot, duration } = req.query;

//   // Validate required query parameters
//   if (!date || !startSlot) {
//     throw new AppError(
//       400,
//       HTTP_STATUS_TEXT.FAIL,
//       "Please provide all required query parameters: date, start slot",
//     );
//   }

//   // Parse duration (default to 1 hour if not provided)
//   const requiredDurationMinutes = duration ? Number(duration) * 60 : 60;

//   // Get all studios
//   const studios = await StudioModel.find({ is_active: true });

//   if (studios.length === 0) {
//     return res.status(404).json({
//       status: HTTP_STATUS_TEXT.FAIL,
//       message: "No studios found",
//     });
//   }

//   // Get date range for the selected date
//   const { startOfDay, endOfDay } = getAllDay(date);

//   // Convert start slot to minutes
//   const startSlotMinutes = timeToMinutes(startSlot);
//   const endSlotMinutes = startSlotMinutes + requiredDurationMinutes;

//   // Get all bookings for the selected date
//   const bookings = await BookingModel.find({
//     date: { $gte: startOfDay, $lt: endOfDay },
//   })
//     .select("studio startSlotMinutes endSlotMinutes startSlot endSlot")
//     .lean();

//   // Check availability for each studio
//   const studiosWithAvailability = studios.map((studio) => {
//     // Get bookings for this specific studio
//     const studioBookings = bookings.filter(
//       (booking) => booking.studio.toString() === studio._id.toString(),
//     );

//     // Check if the requested time slot conflicts with any booking
//     const hasConflict = studioBookings.some((booking) => {
//       const bookingStart =
//         booking.startSlotMinutes || timeToMinutes(booking.startSlot);
//       const bookingEnd =
//         booking.endSlotMinutes || timeToMinutes(booking.endSlot);

//       // Check for overlap: booking overlaps if it starts before our slot ends
//       // and ends after our slot starts
//       return bookingStart < endSlotMinutes && bookingEnd > startSlotMinutes;
//     });

//     // Add availability flag to studio object
//     return {
//       ...studio.toObject(),
//       isAvailable: !hasConflict,
//       availabilityTag: hasConflict ? "booked" : "available",
//     };
//   });

//   res.status(200).json({
//     status: HTTP_STATUS_TEXT.SUCCESS,
//     data: studiosWithAvailability,
//     meta: {
//       date,
//       startSlot,
//       duration: duration || 1,
//       totalStudios: studios.length,
//       availableStudios: studiosWithAvailability.filter((s) => s.isAvailable)
//         .length,
//     },
//   });
// });
