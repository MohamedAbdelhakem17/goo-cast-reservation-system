const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const {
  timeToMinutes,
  minutesToTime,
  getAllDay,
} = require("../../../../utils/time-mange");
const {
  HTTP_STATUS_TEXT,
  USER_ROLE,
  BOOKING_PIPELINE,
  PAYMENT_METHOD,
} = require("../../../../config/system-variables");

const AppError = require("../../../../utils/app-error");

const bookingConfirmationEmailBody = require("../../../../utils/emails-body/booking-confirmation");
const changeBookingStatusEmail = require("../../../../utils/emails-body/booking-change-status");
const { calculateSlotPrices } = require("../../../../utils/priceCalculator");
const sendEmail = require("../../../../utils/send-email");

// Models
const PackageModel = require("../../../../models/hourly-packages-model/hourly-packages-model");
const AddonsModel = require("../../../../models/add-on-model/add-on-model.js");
const BookingModel = require("../../../../models/booking-model/booking-model");
const AuditModel = require("../../../../models/audit-model/audit-model.js");
const StudioModel = require("../../../../models/studio-model/studio-model");
const userProfileModel = require("../../../../models/user-profile-model/user-profile-model");
const userModel = require("../../../../models/user-model/user-model.js");

const changeOpportunityStatus = require("../../../../utils/changeOpportunityStatus.js");

const {
  deleteCalenderEvent,
  updateCalenderEvent,
} = require("../../../../utils/google-calendar-integration.js");

const prepareCreateBookingData = require("./prepare-create-booking-data.js");
const prepareEditBookingData = require("./prepare-edit-booking-data.js");

// Service
const {
  runBookingIntegrations,
} = require("../../../../services/booking-Integration-service.js");

const determineUserTags = require("../../../../utils/tag-engine.js");
// Helpers
const getTimeSlots = (startMinutes, endMinutes, slotDuration = 30) => {
  const slots = [];
  for (
    let time = startMinutes;
    time + slotDuration <= endMinutes;
    time += slotDuration
  ) {
    slots.push(time);
  }
  return slots;
};

const isDurationAvailable = (
  bookedSlots,
  totalSlots,
  requiredDurationMinutes,
  slotDuration = 30,
) => {
  const requiredSlots = Math.ceil(requiredDurationMinutes / slotDuration);

  const availableSlots = totalSlots.filter(
    (slot) => !bookedSlots.includes(slot),
  );

  let consecutive = 0;
  for (let i = 0; i < availableSlots.length; i++) {
    if (i === 0 || availableSlots[i] === availableSlots[i - 1] + slotDuration) {
      consecutive++;
      if (consecutive >= requiredSlots) return true;
    } else {
      consecutive = 1;
    }
  }

  return false;
};

// ---------------------------
// Helper: merge overlapping intervals and check for free gaps
function hasFreeInterval(intervals, startOfDay, endOfDay, requiredMinutes) {
  if (requiredMinutes <= 0) return true;

  if (!intervals || intervals.length === 0) {
    return endOfDay - startOfDay >= requiredMinutes;
  }

  // Normalize and sort
  const sorted = intervals
    .map(([s, e]) => [Number(s), Number(e)])
    .filter(([s, e]) => !isNaN(s) && !isNaN(e) && e > s)
    .sort((a, b) => a[0] - b[0]);

  // Merge overlapping/contiguous intervals
  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length) {
      merged.push([s, e]);
    } else {
      const last = merged[merged.length - 1];
      if (s <= last[1]) {
        last[1] = Math.max(last[1], e);
      } else {
        merged.push([s, e]);
      }
    }
  }

  // Check before first booking
  if (merged[0][0] - startOfDay >= requiredMinutes) return true;

  // Check between merged intervals
  for (let i = 1; i < merged.length; i++) {
    const gap = merged[i][0] - merged[i - 1][1];
    if (gap >= requiredMinutes) return true;
  }

  // Check after last booking
  if (endOfDay - merged[merged.length - 1][1] >= requiredMinutes) return true;

  return false;
}

// Helper: Merge overlapping intervals
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}

// Helper: Get total minutes covered by all intervals
function getTotalCoveredMinutes(intervals) {
  return intervals.reduce((sum, [s, e]) => sum + (e - s), 0);
}

exports.getFullyBookedDates = asyncHandler(async (req, res, next) => {
  // define one working day = 8 hours = 480 minutes
  const FULL_DAY_MINUTES = 8 * 60;

  // date range: today → one month ahead
  const today = new Date();
  const startRange = new Date(today);
  startRange.setHours(0, 0, 0, 0);

  const nextMonth = new Date(startRange);
  nextMonth.setMonth(startRange.getMonth() + 1);
  nextMonth.setHours(23, 59, 59, 999);

  // get all bookings grouped by day
  const bookings = await BookingModel.aggregate([
    {
      $match: {
        date: { $gte: startRange, $lte: nextMonth },
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "+02:00", // adjust as needed
            },
          },
        },
        totalMinutes: {
          $sum: {
            $subtract: ["$endSlotMinutes", "$startSlotMinutes"],
          },
        },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  // filter days where total booked time >= 8 hours
  const fullyBookedDates = bookings
    .filter((b) => b.totalMinutes >= FULL_DAY_MINUTES)
    .map((b) => b._id.day);

  return res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: fullyBookedDates,
  });
});

// ---------------------------
// Main controller ()
// exports.getFullyBookedDates = asyncHandler(async (req, res, next) => {
//   const requiredDurationHours = parseInt(req.query.duration) || 0;
//   const requiredDurationMinutes = requiredDurationHours * 60;

//   // 1️⃣ Fetch all studios
//   const studios = await StudioModel.find();
//   if (!studios || studios.length === 0) {
//     return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "No studios found"));
//   }

//   // 2️⃣ Define date range (from today 00:00 to next month 23:59)
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const nextMonth = new Date(today);
//   nextMonth.setMonth(today.getMonth() + 1);
//   nextMonth.setHours(23, 59, 59, 999);

//   // 3️⃣ Aggregate bookings grouped by date & studio
//   const bookings = await BookingModel.aggregate([
//     {
//       $match: {
//         date: { $gte: today, $lte: nextMonth },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           day: {
//             $dateToString: {
//               format: "%Y-%m-%d",
//               date: "$date",
//               timezone: "+02:00", // adjust if needed
//             },
//           },
//           studio: "$studio",
//         },
//         bookings: {
//           $push: {
//             startSlot: "$startSlotMinutes",
//             endSlot: "$endSlotMinutes",
//           },
//         },
//       },
//     },
//   ]);

//   // 4️⃣ Group by day → { day: { studioId: [bookings] } }
//   const groupedByDate = {};
//   for (const b of bookings) {
//     const day = b._id.day;
//     if (!groupedByDate[day]) groupedByDate[day] = {};
//     groupedByDate[day][b._id.studio.toString()] = b.bookings;
//   }

//   // 5️⃣ Loop over each day, check each studio
//   const fullyBookedDates = [];

//   for (const [day, dayStudios] of Object.entries(groupedByDate)) {
//     let allStudiosFull = true;

//     for (const studio of studios) {
//       const studioBookings = dayStudios[studio._id.toString()] || [];
//       const intervals = studioBookings.map((b) => [b.startSlot, b.endSlot]);

//       const startOfDay = timeToMinutes(studio.startTime);
//       const endOfDay = timeToMinutes(studio.endTime);

//       const available = hasFreeInterval(
//         intervals,
//         startOfDay,
//         endOfDay,
//         requiredDurationMinutes
//       );

//       if (available) {
//         allStudiosFull = false;
//         break;
//       }
//     }

//     if (allStudiosFull) {
//       fullyBookedDates.push(day);
//     }
//   }

//   // 6️⃣ Response
//   res.status(200).json({
//     status: HTTP_STATUS_TEXT.SUCCESS,
//     data: fullyBookedDates,
//   });
// });

exports.getAvailableStudios = asyncHandler(async (req, res, next) => {
  const studios = await StudioModel.find();

  if (studios.length === 0) {
    res.status(404).json({
      status: HTTP_STATUS_TEXT.FAIL,
      message: "No studios found",
    });
  }
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: studios,
  });
});

// exports.getAvailableStartSlots = asyncHandler(async (req, res, next) => {
//   const { studioId, date, duration } = req.body;

//   // ✅ Validation
//   if (!studioId || !date || !duration) {
//     return next(
//       new AppError(400, HTTP_STATUS_TEXT.FAIL, "date and duration are required")
//     );
//   }

//   // ✅ Check if studio exists
//   const studio = await StudioModel.findById(studioId);
//   if (!studio) {
//     return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
//   }

//   // ✅ Working hours (fallback 12:00 - 20:00)
//   const startOfDayMinutes = timeToMinutes(studio.startTime || "12:00");
//   const endOfDayMinutes = timeToMinutes(studio.endTime || "20:00");
//   const requiredDurationMinutes = parseFloat(duration) * 60;

//   // ✅ Parse input date
//   const requestedDate = new Date(date);
//   const today = new Date();
//   const isToday = requestedDate.toDateString() === today.toDateString();

//   // ✅ Minimum start time
//   let minStartTimeMinutes = startOfDayMinutes;
//   if (isToday) {
//     // For today, start from next available 30-minute slot
//     const currentMinutes = today.getHours() * 60 + today.getMinutes();
//     const nextSlotMinutes = Math.ceil(currentMinutes / 30) * 30;
//     minStartTimeMinutes = Math.max(startOfDayMinutes, nextSlotMinutes);
//   }

//   // ✅ Date range for query
//   const inputDate = getAllDay(date);

//   // ✅ Global bookings: get all bookings across ALL studios for that date
//   const bookings = await BookingModel.find({
//     date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
//   }).select("startSlot endSlot startSlotMinutes endSlotMinutes studio");

//   const availableSlots = [];

//   // ✅ Loop through all possible 30-min intervals
//   for (
//     let time = minStartTimeMinutes;
//     time <= endOfDayMinutes - requiredDurationMinutes;
//     time += 30
//   ) {
//     const slotStart = time;
//     const slotEnd = time + requiredDurationMinutes;

//     // ✅ Check if slot overlaps with ANY booking from ANY studio
//     const hasConflict = bookings.some((booking) => {
//       const bookingStart = booking.startSlotMinutes || booking.startSlot;
//       const bookingEnd = booking.endSlotMinutes || booking.endSlot;

//       return bookingStart < slotEnd && bookingEnd > slotStart;
//     });

//     if (!hasConflict) {
//       availableSlots.push({
//         startTime: minutesToTime(slotStart),
//         startTimeMinutes: slotStart,
//         endTime: minutesToTime(slotEnd),
//         endTimeMinutes: slotEnd,
//       });
//     }
//   }

//   // ✅ Response
//   res.status(200).json({
//     status: HTTP_STATUS_TEXT.SUCCESS,
//     data: availableSlots,
//     meta: {
//       requestedDate: date,
//       duration: duration,
//       studioWorkingHours: {
//         start: studio.startTime,
//         end: studio.endTime,
//       },
//       totalAvailableSlots: availableSlots.length,
//     },
//   });
// });

// merge sorted or unsorted intervals [[s,e],...]
function mergeIntervals(intervals) {
  if (!intervals || intervals.length === 0) return [];
  const sorted = intervals
    .map(([s, e]) => [Number(s), Number(e)])
    .filter(([s, e]) => Number.isFinite(s) && Number.isFinite(e) && e > s)
    .sort((a, b) => a[0] - b[0]);

  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length) merged.push([s, e]);
    else {
      const last = merged[merged.length - 1];
      if (s <= last[1]) last[1] = Math.max(last[1], e);
      else merged.push([s, e]);
    }
  }
  return merged;
}

// check if [start, end) overlaps any merged busy interval
function overlapsAny(start, end, merged) {
  // binary search could be used for large arrays; linear is fine for small lists
  for (const [bs, be] of merged) {
    if (bs < end && be > start) return true;
    // optimization: if bs >= end then no later intervals overlap
    if (bs >= end) return false;
  }
  return false;
}

exports.getAvailableStartSlots = asyncHandler(async (req, res, next) => {
  const { studioId, date, duration } = req.body;

  // basic validation
  if (!studioId || !date || duration == null) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "studioId, date and duration are required",
      ),
    );
  }

  const requiredDurationMinutes = Number(duration) * 60;
  if (
    !Number.isFinite(requiredDurationMinutes) ||
    requiredDurationMinutes <= 0
  ) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "duration must be a positive number",
      ),
    );
  }

  const studio = await StudioModel.findById(studioId);
  if (!studio)
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));

  // working window for this studio
  const startOfDayMinutes = timeToMinutes(studio.startTime || "09:00");
  const endOfDayMinutes = timeToMinutes(studio.endTime || "20:00");
  if (
    startOfDayMinutes === null ||
    endOfDayMinutes === null ||
    endOfDayMinutes <= startOfDayMinutes
  ) {
    return next(
      new AppError(500, HTTP_STATUS_TEXT.FAIL, "Invalid studio working hours"),
    );
  }
  const totalDayMinutes = endOfDayMinutes - startOfDayMinutes;

  // if required duration longer than working day -> no slots
  if (requiredDurationMinutes > totalDayMinutes) {
    return res.status(200).json({
      status: HTTP_STATUS_TEXT.SUCCESS,
      data: [],
      meta: { totalAvailableSlots: 0 },
    });
  }

  // date range for DB query — ensure getAllDay returns consistent timezone-aware range
  const inputDate = getAllDay(date); // { startOfDay: Date, endOfDay: DateExclusive }
  if (!inputDate || !inputDate.startOfDay || !inputDate.endOfDay) {
    return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid date"));
  }

  const today = new Date();
  const requestedDate = new Date(date);
  const isToday = requestedDate.toDateString() === today.toDateString();

  // compute min start (for today: next slot)
  let minStartTimeMinutes = startOfDayMinutes;
  if (isToday) {
    const currentMinutes = today.getHours() * 60 + today.getMinutes();
    const nextSlotMinutes = Math.ceil(currentMinutes / 30) * 30;
    minStartTimeMinutes = Math.max(startOfDayMinutes, nextSlotMinutes);
  }

  // fetch bookings across ALL studios for that date
  const bookings = await BookingModel.find({
    date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
    status: { $ne: BOOKING_PIPELINE.CANCELED },
  }).select("startSlotMinutes endSlotMinutes");

  // normalize booking intervals into minutes
  const rawIntervals = bookings
    .map((b) => {
      // prefer numeric minutes fields; fallback to parsing string if necessary
      const s = Number.isFinite(b.startSlotMinutes)
        ? b.startSlotMinutes
        : typeof b.startSlot === "string"
          ? timeToMinutes(b.startSlot)
          : NaN;
      const e = Number.isFinite(b.endSlotMinutes)
        ? b.endSlotMinutes
        : typeof b.endSlot === "string"
          ? timeToMinutes(b.endSlot)
          : NaN;
      return [s, e];
    })
    .filter(([s, e]) => Number.isFinite(s) && Number.isFinite(e) && e > s);

  // clamp intervals to studio working hours (optional but recommended)
  const clamped = rawIntervals
    .map(([s, e]) => [
      Math.max(s, startOfDayMinutes),
      Math.min(e, endOfDayMinutes),
    ])
    .filter(([s, e]) => e > s);

  const mergedBusy = mergeIntervals(clamped);

  // iterate candidate starts (step 30)
  const availableSlots = [];
  for (
    let t = minStartTimeMinutes;
    t <= endOfDayMinutes - requiredDurationMinutes;
    t += 30
  ) {
    const slotStart = t;
    const slotEnd = t + requiredDurationMinutes;
    if (!overlapsAny(slotStart, slotEnd, mergedBusy)) {
      availableSlots.push({
        startTime: minutesToTime(slotStart),
        startTimeMinutes: slotStart,
        endTime: minutesToTime(slotEnd),
        endTimeMinutes: slotEnd,
      });
    }
  }

  return res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: availableSlots,
    meta: {
      requestedDate: date,
      duration,
      studioWorkingHours: { start: studio.startTime, end: studio.endTime },
      totalAvailableSlots: availableSlots.length,
    },
  });
});

exports.getAvailableEndSlots = asyncHandler(async (req, res, next) => {
  const { studioId, date, startTime, package } = req.body;

  if (!studioId || !date || !startTime || !package) {
    return next(
      new AppError(
        400,
        HTTP_STATUS_TEXT.FAIL,
        "studioId, date, startTime, and package are required",
      ),
    );
  }

  const studio = await StudioModel.findById(studioId);
  if (!studio) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
  }

  const selectedPackage = await PackageModel.findById(package);
  if (!selectedPackage) {
    return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found"));
  }

  const inputDate = getAllDay(date);
  const startSlotMinutes = timeToMinutes(startTime);
  const endOfDayMinutes = timeToMinutes(studio.endTime || "22:00");

  const bookings = await BookingModel.find({
    studio: studioId,
    date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
    startSlotMinutes: { $lt: endOfDayMinutes },
    endSlotMinutes: { $gt: startSlotMinutes },
  });

  const bookedSlots = bookings.map((book) => ({
    start: book.startSlotMinutes,
    end: book.endSlotMinutes,
  }));

  const availableEndSlots = await calculateSlotPrices({
    package: selectedPackage,
    date,
    startSlotMinutes,
    endOfDay: endOfDayMinutes,
    bookedSlots,
  });

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: availableEndSlots,
  });
});

// Get all bookings
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { status, studioId, date, range, page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let match = {};

  // Filter by status
  if (status) {
    match.status = status;
  }

  // Filter by studio
  if (studioId) {
    match.studio = new mongoose.Types.ObjectId(studioId);
  }

  // ============================
  // 📌 Time Range Filters
  // range = today | this-week | this-month
  // date  = YYYY-MM-DD (optional)
  // ============================
  if (range) {
    const now = new Date();

    if (range === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      match.date = { $gte: start, $lte: end };
    }

    if (range === "this-week") {
      const currentDay = now.getDay(); // 0-6
      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

      const start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);

      match.date = { $gte: start, $lte: end };
    }

    if (range === "this-month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      match.date = { $gte: start, $lte: end };
    }
  }

  // ============================
  // 📌 Filter by specific date YYYY-MM-DD
  // This overrides range if both exist
  // ============================
  if (date) {
    const day = new Date(date);
    const start = new Date(day.setHours(0, 0, 0, 0));
    const end = new Date(day.setHours(23, 59, 59, 999));

    match.date = {
      $gte: start,
      $lte: end,
    };
  }

  // Count
  const total = await BookingModel.countDocuments(match);

  // Fetch
  const allBookings = await BookingModel.find(match).sort({ createdAt: -1 });

  // Priority Sorting
  const statusPriority = {
    pending: 0,
    approved: 1,
    rejected: 2,
  };

  allBookings.sort((a, b) => {
    const statusA = statusPriority[a.status] ?? 3;
    const statusB = statusPriority[b.status] ?? 3;

    if (statusA !== statusB) return statusA - statusB;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Pagination
  const paginated = allBookings.slice(skip, skip + limitNum);

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: {
      bookings: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// Update booking status and handle related actions (email, calendar, opportunity)
exports.changeBookingStatus = asyncHandler(async (req, res) => {
  const id = req.params.id || req.body.id;
  const { status } = req.body;

  // Validate provided status
  const allowedStatuses = Object.values(BOOKING_PIPELINE);
  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid or missing status");
  }

  // Find booking before updating to trigger Mongoose hooks if needed
  const booking = await BookingModel.findById(id).populate("studio", "name");
  if (!booking)
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Booking not found");

  booking.status = status;
  await booking.save();

  const { opportunityID, eventID } = booking;

  try {
    // If booking is approved
    if (status === "approved") {
      await changeOpportunityStatus(opportunityID, "won");

      // Send approval email to customer
      await sendEmail({
        to: booking.personalInfo.email,
        subject: "Booking Approved",
        message: changeBookingStatusEmail({ type: "approved", data: booking }),
      });
    }

    // If booking is rejected
    if (status === "rejected") {
      await deleteCalenderEvent(eventID);
      await changeOpportunityStatus(opportunityID, "lost");

      // Send rejection email to customer
      await sendEmail({
        to: booking.personalInfo.email,
        subject: "Booking Rejected",
        message: changeBookingStatusEmail({ type: "rejected", data: booking }),
      });
    }
  } catch (err) {
    // Log any side effect errors (email, calendar, etc.)
    console.error("Status change side effects failed:", err.message);
  }

  // Send response back to client
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: booking,
    message: "Booking status updated successfully",
  });
});

// Create Booking
exports.createBooking = asyncHandler(async (req, res) => {
  const user = req.isAuthenticated() ? req.user : undefined;

  const {
    tempBooking,
    studio,
    pkg,
    addOns,
    bookingDate,
    personalInfo,
    totalAddOnsPriceFromDb,
    startSlot,
    endSlot,
    totalPriceAfterDiscount,
    duration,
  } = await prepareCreateBookingData(req.body, user, false);

  // Get Assign User
  const manager = await userModel
    .findOne({ role: USER_ROLE.MANAGER })
    .select("_id");

  tempBooking.assignTo = manager._id;

  // Save data in database
  const booking = await tempBooking.save();

  const bookedUser = await userProfileModel.findById(booking.personalInfo);

  await bookedUser.recordBooking(
    booking._id,
    booking.createdAt,
    booking.totalPriceAfterDiscount || booking.totalPrice,
  );

  await bookedUser.save();

  await AuditModel.create({
    actor: req.user?.id ? req.user?.id : null,
    action: "create",
    model: BookingModel.modelName,
    targetId: booking?._id,
    changes: {
      key: "Create",
      old: "",
      new: `Create new Booking at ${booking.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
    },
    ip: req.ip,
  });

  // return response for user
  res.status(201).json({
    status: "success",
    message: "Booking created successfully",
    booking,
  });

  // create integrations with GHL , email , calendar
  process.nextTick(() => {
    runBookingIntegrations({
      booking,
      integrationData: {
        studio,
        pkg,
        addOns,
        bookingDate,
        personalInfo,
        totalAddOnsPriceFromDb,
        startSlot,
        endSlot,
        totalPriceAfterDiscount,
        duration,
      },
    });
  });
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const existingBooking = await BookingModel.findById(bookingId);
  if (!existingBooking)
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Booking not found");

  const updates = await prepareEditBookingData(req.body, existingBooking);

  // Optional: check overlapping bookings
  const bookings = await BookingModel.find({
    date: existingBooking.date,
    _id: { $ne: bookingId },
  }).select("startSlotMinutes endSlotMinutes");
  const mergedBusy = mergeIntervals(
    bookings.map((b) => [b.startSlotMinutes, b.endSlotMinutes]),
  );
  if (
    overlapsAny(updates.startSlotMinutes, updates.endSlotMinutes, mergedBusy)
  ) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "This time is already booked",
    );
  }

  const updatedBooking = await BookingModel.findByIdAndUpdate(
    bookingId,
    { $set: updates },
    { new: true },
  );

  // Update Google Calendar if needed
  const eventChanged =
    (updates.startSlot && updates.startSlot !== existingBooking.startSlot) ||
    (updates.endSlot && updates.endSlot !== existingBooking.endSlot) ||
    (updates.date &&
      new Date(updates.date).toISOString() !==
        existingBooking.date.toISOString());

  if (existingBooking.googleEventId && eventChanged) {
    try {
      const startDateTime = new Date(
        updatedBooking.date.toISOString().split("T")[0] +
          "T" +
          updatedBooking.startSlot +
          ":00",
      );
      const endDateTime = new Date(
        updatedBooking.date.toISOString().split("T")[0] +
          "T" +
          updatedBooking.endSlot +
          ":00",
      );

      const eventData = {
        summary: `Booking - ${updatedBooking.studio?.name?.en}`,
        description: `Updated booking for ${updatedBooking.personalInfo?.name}`,
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
      };
      await updateCalenderEvent(existingBooking.googleEventId, eventData);
    } catch (err) {
      console.warn("⚠️ Failed to update Google Calendar event:", err.message);
    }
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Booking updated successfully",
    booking: updatedBooking,
  });
});

// Get User Booking History
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const bookings = await BookingModel.find({ createdBy: _id });
  if (!bookings)
    res.status(200).json({
      status: HTTP_STATUS_TEXT.SUCCESS,
      message: "No bookings found",
      data: bookings,
    });
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

// Get single booking
exports.getSingleBooking = asyncHandler(async (req, res) => {
  // get exist Booking
  const { id } = req.params;
  const existBooking = await BookingModel.findById(id);

  // if Booking not exist
  if (!existBooking) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "This booking not exist");
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    message: "Bookings retrieve successfully",
    data: existBooking,
  });
});

// Booking with n8n
exports.n8nBooking = asyncHandler(async (req, res) => {
  // ========================================
  // 1. Extract data from request
  // ========================================
  const {
    studioId,
    packageId,
    selectedAddOns, // string format: "id1,id2,id3"
    email,
    phone,
    firstName,
    lastName,
    extraComment,
    totalPrice,
    duration,
    persons,
    date,
    paymentMethod,
  } = req.body;

  // ========================================
  // 2. Validate required fields
  // ========================================
  const requiredFields = {
    studioId,
    packageId,
    email,
    phone,
    firstName,
    lastName,
    totalPrice,
    duration,
    persons,
    date,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) => value === undefined || value === null || value === "",
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: HTTP_STATUS_TEXT.FAIL,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // ========================================
  // 3. Verify studio exists
  // ========================================
  const studio = await StudioModel.findById(studioId);
  if (!studio) {
    return res.status(404).json({
      success: HTTP_STATUS_TEXT.FAIL,
      message: "Studio not found. Please select another one.",
    });
  }

  // ========================================
  // 4. Verify package exists
  // ========================================
  const pkg = await PackageModel.findById(packageId);
  if (!pkg) {
    return res.status(404).json({
      success: HTTP_STATUS_TEXT.FAIL,
      message: "Package not found. Please select another one.",
    });
  }

  // ========================================
  // 5. Verify add-ons
  // ========================================
  let selectedAddOnsData = [];
  let addOnIds = [];

  if (selectedAddOns) {
    // Convert string to array of IDs
    addOnIds = selectedAddOns
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (addOnIds.length > 0) {
      selectedAddOnsData = await AddonsModel.find({
        _id: { $in: addOnIds },
      });

      if (selectedAddOnsData.length !== addOnIds.length) {
        return res.status(404).json({
          success: HTTP_STATUS_TEXT.FAIL,
          message: "One or more add-ons not found.",
        });
      }
    }
  }

  // ========================================
  // 6. Calculate time and dates
  // ========================================
  const bookingDate = new Date(date);

  // Validate date format
  if (isNaN(bookingDate.getTime())) {
    return res.status(400).json({
      success: HTTP_STATUS_TEXT.FAIL,
      message: "Invalid date format",
    });
  }

  // Helper function to convert time to minutes
  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Helper function to convert minutes to time
  function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  const startSlot = bookingDate.toISOString().slice(11, 16);
  const startSlotMinutes = timeToMinutes(startSlot);
  const endSlotMinutes = startSlotMinutes + duration * 60;
  const endSlot = minutesToTime(endSlotMinutes);

  // ========================================
  // 7. Check for time slot conflicts
  // ========================================
  const { startOfDay, endOfDay } = getAllDay(bookingDate);

  const conflictQuery = {
    studio: studioId,
    date: { $gte: startOfDay, $lt: endOfDay },
    startSlotMinutes: { $lt: endSlotMinutes },
    endSlotMinutes: { $gt: startSlotMinutes },
  };

  const conflictBooking = await BookingModel.exists(conflictQuery);

  if (conflictBooking) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "This time slot is already booked",
    );
  }

  // ========================================
  // 8. Calculate prices
  // ========================================

  // Calculate package price
  const slotPrices = await calculateSlotPrices({
    package: pkg,
    date: bookingDate,
    startSlotMinutes,
    endOfDay: endSlotMinutes,
    duration,
    bookedSlots: [],
  });

  const packagePrice = slotPrices[slotPrices.length - 1].totalPrice;

  // Calculate add-ons price with quantity
  let totalAddOnsPrice = 0;
  const addOnDetails = [];

  if (addOnIds.length > 0) {
    // Count occurrences of each add-on ID
    const addOnCounts = {};
    addOnIds.forEach((id) => {
      addOnCounts[id] = (addOnCounts[id] || 0) + 1;
    });

    // Calculate price for each unique add-on
    for (const addOn of selectedAddOnsData) {
      const addOnId = addOn._id.toString();
      const quantity = addOnCounts[addOnId] || 1;
      const unitPrice = addOn.price || 0;
      const totalPriceForAddOn = unitPrice * quantity;

      totalAddOnsPrice += totalPriceForAddOn;

      addOnDetails.push({
        item: addOn._id,
        quantity: quantity,
        price: totalPriceForAddOn,
      });
    }
  }

  // Calculate total price
  const calculatedTotalPrice = Math.round(packagePrice + totalAddOnsPrice);

  // Verify price sent by client
  if (totalPrice !== calculatedTotalPrice) {
    return res.status(400).json({
      success: HTTP_STATUS_TEXT.FAIL,
      message: `Price mismatch. Expected: ${calculatedTotalPrice}, Received: ${totalPrice}`,
    });
  }

  // ========================================
  // 9. Manage user profile
  // ========================================
  let userProfile = await userProfileModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (userProfile) {
    // Update tags for existing user
    userProfile.tags = determineUserTags(userProfile);
    await userProfile.save();
  } else {
    // Create new user
    userProfile = await userProfileModel.create({
      firstName,
      lastName,
      email,
      phone,
    });

    userProfile.tags = determineUserTags(userProfile);
    await userProfile.save();
  }

  // ========================================
  // 10. Get assigned manager
  // ========================================
  const manager = await userModel
    .findOne({ role: USER_ROLE.MANAGER })
    .select("_id");

  // ========================================
  // 11. Create booking data
  // ========================================
  const bookingData = {
    studio: studio._id,
    date: bookingDate,
    startSlot,
    endSlot,
    startSlotMinutes,
    endSlotMinutes,
    duration,
    persons,
    package: pkg._id,
    addOns: addOnDetails,
    totalAddOnsPrice,
    totalPackagePrice: packagePrice,
    personalInfo: userProfile._id,
    extraComments: extraComment || "",
    totalPrice: calculatedTotalPrice,
    totalPriceAfterDiscount: calculatedTotalPrice, // Can be modified based on discounts
    paymentMethod: paymentMethod || PAYMENT_METHOD.CASH,
    status: BOOKING_PIPELINE.NEW,
    assignTo: manager?._id || null,
    createdBy: req.user?.id || null, // Use current user instead of Admin
  };

  // ========================================
  // 12. Save booking to database
  // ========================================
  const booking = await BookingModel.create(bookingData);

  // ========================================
  // 13. Update user record
  // ========================================
  await userProfile.recordBooking(
    booking._id,
    booking.createdAt,
    booking.totalPriceAfterDiscount || booking.totalPrice,
  );

  await userProfile.save();

  // ========================================
  // 14. Create audit log
  // ========================================
  await AuditModel.create({
    actor: req.user?.id || null,
    action: "create",
    model: BookingModel.modelName,
    targetId: booking._id,
    changes: {
      key: "Create",
      old: "",
      new: `Created new booking at ${booking.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
    },
    ip: req.ip,
  });

  // ========================================
  // 15. Send response
  // ========================================
  res.status(201).json({
    status: "success",
    message: "Booking created successfully",
    data: {
      booking,
    },
  });

  // ========================================
  // 16. Run integrations in background
  // ========================================
  process.nextTick(() => {
    runBookingIntegrations({
      booking,
      integrationData: {
        studio,
        package: pkg,
        addOns: selectedAddOnsData,
        bookingDate,
        personalInfo: {
          firstName,
          lastName,
          email,
          phone,
          comments: extraComment,
        },
        totalAddOnsPrice,
        startSlot,
        endSlot,
        totalPriceAfterDiscount: calculatedTotalPrice,
        duration,
      },
    });
  });
});

// {
//   "studioId":  "68487d7e5a067463a3298a64",
//   "packageId": "681c9c7499ea41aecd27ad76",
//   "selectedAddOns":"67fe85767663f45575657bea,67fe85767663f45575657bea,67fe85767663f45575657bea"
//   "email": "mohamed.abdelhakem3200@gmail.com"
//   "phone": "01009474429",
//   "firstName": "Mohamed",
//   "lastName": "Abdelhakem",
//   "extraComment":"6910ad0b675bdddd4f421ded",
//   "totalPrice": 8500,
//   "duration": 1,
//   "persons": 1,
//   "date": "2025-11-10T10:00:00.000Z",
// }
