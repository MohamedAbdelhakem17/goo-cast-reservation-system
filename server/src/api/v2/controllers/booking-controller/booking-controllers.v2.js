const asyncHandler = require("express-async-handler");
const StudioModel = require("../../../../models/studio-model/studio-model");
const BookingModel = require("../../../../models/booking-model/booking-model");
const {
  HTTP_STATUS_TEXT,
  BOOKING_PIPELINE,
} = require("../../../../config/system-variables");
const AppError = require("../../../../utils/app-error");
const {
  getAllDay,
  timeToMinutes,
  minutesToTime,
} = require("../../../../utils/time-mange");
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
    is_available: !bookedSet.has(studio._id.toString()),
  }));

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: result,
  });
});

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

// count how many times [start, end) overlaps with booking intervals
function countOverlaps(start, end, intervals) {
  let count = 0;
  for (const [bs, be] of intervals) {
    if (bs < end && be > start) count++;
  }
  return count;
}

/**
 * Get available time slots for booking
 * @route POST /api/v2/bookings/available-slots
 * @param {string} req.body.date - Date in YYYY-MM-DD format
 * @param {number} req.body.duration - Duration in hours
 * @returns {Object} Available time slots array
 */
exports.getAvailableStartSlots = asyncHandler(async (req, res, next) => {
  const { studioId, date, duration } = req.body;

  // basic validation
  if (/**!studioId ||**/ !date || duration == null) {
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

  // const studio = await StudioModel.findById(studioId);
  // if (!studio)
  //   return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));

  // working window for this studio
  const startOfDayMinutes = timeToMinutes("09:00");
  const endOfDayMinutes = timeToMinutes("20:00");
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

  // Don't merge intervals - keep them separate to count overlaps
  // const mergedBusy = mergeIntervals(clamped);

  // iterate candidate starts (step 30)
  const availableSlots = [];
  const MAX_BOOKINGS_PER_SLOT = 2; // Allow up to 2 bookings per slot

  for (
    let t = minStartTimeMinutes;
    t <= endOfDayMinutes - requiredDurationMinutes;
    t += 30
  ) {
    const slotStart = t;
    const slotEnd = t + requiredDurationMinutes;
    // Check if this slot has less than 2 bookings
    const overlapCount = countOverlaps(slotStart, slotEnd, clamped);
    if (overlapCount < MAX_BOOKINGS_PER_SLOT) {
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
      studioWorkingHours: { start: "09:00", end: "20:00" },
      totalAvailableSlots: availableSlots.length,
    },
  });
});
