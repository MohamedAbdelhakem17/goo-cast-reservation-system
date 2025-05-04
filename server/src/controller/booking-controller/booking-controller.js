const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const { timeToMinutes, minutesToTime, getAllDay } = require("../../utils/time-mange")
const AppError = require("../../utils/app-error");
const BookingModel = require("../../models/booking-model/booking-model");
const StudioModel = require("../../models/studio-model/studio-model")
const { calculateSlotPrices } = require("../../utils/priceCalculator");


// get fully booked dates for a studio
exports.getFullyBookedDates = asyncHandler(async (req, res, next) => {
    const { studioId } = req.params;

    // Check if studio exists
    const studio = await StudioModel.findById(studioId)
    if (!studio) return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));

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

    const startOfDay = timeToMinutes(studio?.startTime)
    const endOfDay = timeToMinutes(studio?.endTime)
    const totalMinutesInDay = endOfDay - startOfDay

    // Check if the total minutes for each day is greater than or equal to the studio's working hours
    const fullyBookedDates = Object.keys(totalMinutesPerDay).filter(date => totalMinutesPerDay[date] >= totalMinutesInDay);


    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: fullyBookedDates
    });
});

// exports.getAvailableSlots = asyncHandler(async (req, res, next) => {
//     const { studioId, date, duration = 1 } = req.body;

//     // Validate input
//     if (!studioId || !date || !duration) {
//         return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studioId, date, and duration are required"));
//     }

//     // Get the studio's working hours
//     const studio = await StudioModel.findById(studioId);

//     if (!studio) {
//         return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
//     }

//     // Convert start and end time to minutes
//     const startOfDay = timeToMinutes(studio.startTime || "08:00");
//     const endOfDay = timeToMinutes(studio.endTime != 0 ? studio.endTime : "22:00");

//     const durationInMinutes = duration * 60;


//     // Get bookings for the specified date
//     const inputDate = getAllDay(date);

//     const bookings = await BookingModel.find({
//         studio: studioId,
//         date: {
//             $gte: inputDate.startOfDay,
//             $lt: inputDate.endOfDay,
//         },
//     });


//     if (bookings.length === 0) {
//         // console.log("No bookings found for this date"); 
//     }

//     const bookedSlots = bookings.map(book => {
//         const start = timeToMinutes(book.timeSlot);
//         const end = start + (book.duration * 60);
//         return { start, end };
//     });

//     // console.log('Booked slots:', bookedSlots);

//     // Calculate available slots
//     const availableSlots = [];

//     // Check available slots within the studio's working hours
//     for (let time = startOfDay; time + durationInMinutes <= endOfDay; time += 60) {

//         const slotStart = time;
//         const slotEnd = time + durationInMinutes;

//         // Skip slot if it exceeds the studio's working hours
//         if (slotEnd > endOfDay) {
//             continue;
//         }

//         const isOverlapping = bookedSlots.some(b =>
//             (slotStart < b.end && slotEnd > b.start)
//         );

//         if (!isOverlapping) {
//             availableSlots.push({
//                 startTime: minutesToTime(slotStart),
//             });
//         }
//     }



//     res.status(200).json({
//         status: HTTP_STATUS_TEXT.SUCCESS,
//         data: availableSlots,
//     });
// });

exports.getAvailableStartSlots = asyncHandler(async (req, res, next) => {
    const { studioId, date } = req.body;

    if (!studioId || !date) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studioId and date are required"));
    }

    const studio = await StudioModel.findById(studioId);
    if (!studio) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const startOfDay = timeToMinutes(studio.startTime || "08:00");
    const endOfDay = timeToMinutes(studio.endTime || "22:00");

    const inputDate = getAllDay(date);

    const bookings = await BookingModel.find({
        studio: studioId,
        date: {
            $gte: inputDate.startOfDay,
            $lt: inputDate.endOfDay,
        },
    });

    const bookedSlots = bookings.map(book => {
        const start = timeToMinutes(book.timeSlot);
        const end = start + (book.duration * 60);
        return { start, end };
    });

    const availableSlots = [];

    for (let time = startOfDay; time < endOfDay; time += 60) {
        const slotEnd = time + 60;

        const isOverlapping = bookedSlots.some(b =>
            (time < b.end && slotEnd > b.start)
        );

        if (!isOverlapping) {
            availableSlots.push({ startTime: minutesToTime(time) });
        }
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: availableSlots,
    });
});

exports.getAvailableEndSlots = asyncHandler(async (req, res, next) => {
    const { studioId, date, startTime } = req.body;

    console.log(date,  "date From Booking Controller");
    // if (!studioId || !date || !startTime) {
    //     return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studio, date, and startTime are required"));
    // }

    const studio = await StudioModel.findById(studioId);
    if (!studio) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const inputDate = getAllDay(date);

    const bookings = await BookingModel.find({
        studio: studioId,
        date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
    });

    const bookedSlots = bookings.map(book => {
        const start = timeToMinutes(book.timeSlot);
        const end = start + (book.duration * 60);
        return { start, end };
    });

    const startSlotMinutes = timeToMinutes(startTime);
    const endOfDay = timeToMinutes(studio.endTime || "22:00");

    const availableEndSlots = await calculateSlotPrices({
        studio,
        date,
        startSlotMinutes,
        endOfDay,
        bookedSlots,
    });

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: availableEndSlots,
    });
});


// Get all bookings
exports.getAllBookings = asyncHandler(async (req, res) => {
    const { status, studioId, date, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let match = {};

    if (status) {
        match.status = status;
    }

    if (studioId) {
        match.studio = new mongoose.Types.ObjectId(studioId);
    }

    if (date) {
        const inputDate = getAllDay(date);
        match.date = {
            $gte: inputDate.startOfDay,
            $lt: inputDate.endOfDay
        };
    }

    const total = await BookingModel.countDocuments(match);

    const bookings = await BookingModel.aggregate([
        { $match: match },
        {
            $addFields: {
                statusOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$status", "pending"] }, then: 1 },
                            { case: { $eq: ["$status", "approved"] }, then: 2 },
                            { case: { $eq: ["$status", "rejected"] }, then: 3 }
                        ],
                        default: 4
                    }
                }
            }
        },
        { $sort: { statusOrder: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        {
            $lookup: {
                from: 'studios',
                localField: 'studio',
                foreignField: '_id',
                as: 'studio'
            }
        },
        {
            $unwind: {
                path: '$studio',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: {
            bookings,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        }
    });
});

// Change booking status
exports.changeBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Status is required");
    }

    if (status !== "pending" && status !== "approved" && status !== "rejected") {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid status");
    }

    const booking = await BookingModel.findByIdAndUpdate(id, { status }, {
        new: true,
        runValidators: true,
    });

    if (!booking) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Booking not found");
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: booking,
        message: "Booking status updated successfully"
    });
});