const asyncHandler = require("express-async-handler");

const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const { timeToMinutes, minutesToTime, getAllDay } = require("../../utils/time-mange")
const AppError = require("../../utils/app-error");
const BookingModel = require("../../models/booking-model/booking-model");
const StudioModel = require("../../models/studio-model/studio-model")


// get fully booked dates for a studio
exports.getFullyBookedDates = asyncHandler(async (req, res, next) => {
    const { studioId } = req.params;
    const bookings = await BookingModel.find({ studio: studioId });
    if (bookings.length === 0) {
        return res.status(200).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            data: [],
        });
    }

    // Calculate total minutes for each day
    const totalMinutesPerDay = {};

    bookings.forEach(booking => {
        const day = booking.date;
        const durationInMinutes = booking.duration * 60;
        if (!totalMinutesPerDay[day]) {
            totalMinutesPerDay[day] = 0;
        }
        totalMinutesPerDay[day] += durationInMinutes;
    });

    // Find fully booked dates
    const studio = await StudioModel.findById(studioId)
    if (!studio) return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));

    const startOfDay = timeToMinutes(studio?.strateTime)
    const endOfDay = timeToMinutes(studio?.endTime)
    const totalMinutesInDay = endOfDay - startOfDay

    // Check if the total minutes for each day is greater than or equal to the studio's working hours
    const fullyBookedDates = Object.keys(totalMinutesPerDay).filter(date => totalMinutesPerDay[date] >= totalMinutesInDay);


    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: fullyBookedDates
    });
});

exports.getAvailableSlots = asyncHandler(async (req, res, next) => {
    const { studioId, date, duration = 1 } = req.body;

    // Validate input
    if (!studioId || !date || !duration) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studioId, date, and duration are required"));
    }

    // Get the studio's working hours
    const studio = await StudioModel.findById(studioId);

    if (!studio) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    // Convert start and end time to minutes
    const startOfDay = timeToMinutes(studio.strateTime); // fixed typo
    const endOfDay = timeToMinutes(studio.endTime);

    const durationInMinutes = duration * 60;

    console.log(`Studio working hours in minutes: ${startOfDay} to ${endOfDay}`);

    // Get bookings for the specified date
    const inputDate = getAllDay(date);

    const bookings = await BookingModel.find({
        studio: studioId,
        date: {
            $gte: inputDate.startOfDay,
            $lt: inputDate.endOfDay,
        },
    });

    console.log(`Bookings for date ${date}:`, bookings);

    if (bookings.length === 0) {
        console.log("No bookings found for this date");
    }

    const bookedSlots = bookings.map(book => {
        const start = timeToMinutes(book.timeSlot);
        const end = start + (book.duration * 60);
        return { start, end };
    });

    console.log('Booked slots:', bookedSlots);

    // Calculate available slots
    const availableSlots = [];

    // Check available slots within the studio's working hours
    for (let time = startOfDay; time + durationInMinutes <= endOfDay; time += 60) {

        const slotStart = time;
        const slotEnd = time + durationInMinutes;

        // Skip slot if it exceeds the studio's working hours
        if (slotEnd > endOfDay) {
            continue;
        }

        const isOverlapping = bookedSlots.some(b =>
            (slotStart < b.end && slotEnd > b.start)
        );

        if (!isOverlapping) {
            availableSlots.push({
                startTime: minutesToTime(slotStart),
            });
        }
    }


    console.log('Available slots:', availableSlots);

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: availableSlots,
    });
});
