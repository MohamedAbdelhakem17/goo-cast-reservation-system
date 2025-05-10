const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const { timeToMinutes, minutesToTime, getAllDay } = require("../../utils/time-mange")
const { HTTP_STATUS_TEXT } = require("../../config/system-variables");
const AppError = require("../../utils/app-error");

const bookingConfirmationEmailBody = require("../../utils/emails-body/booking-confirmation");
const changeBookingStatusEmail = require("../../utils/emails-body/booking-change-status")
const { calculatePackagePrices } = require("../../utils/package-price-calculator");
const { calculateSlotPrices } = require("../../utils/priceCalculator");
const sendEmail = require("../../utils/send-email");

// Models
const PackageModel = require("../../models/hourly-packages-model/hourly-packages-model")
const BookingModel = require("../../models/booking-model/booking-model");
const StudioModel = require("../../models/studio-model/studio-model")
const AddOnModel = require("../../models/add-on-model/add-on-model")

// old code For getting available slots
{
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
}

// Get Available Studio in a day
exports.getAvailableStudios = asyncHandler(async (req, res, next) => {
    const { date } = req.params;

    if (!date) {
        return res.status(400).json({
            status: HTTP_STATUS_TEXT.FAIL,
            message: "Date is required",
        });
    }

    const studios = await StudioModel.find();

    const { startOfDay, endOfDay } = getAllDay(date);
    const bookings = await BookingModel.find({
        date: { $gte: startOfDay, $lt: endOfDay },
    });

    const studiosAvailability = [];

    for (const studio of studios) {
        const studioBookings = bookings.filter(
            (booking) => booking.studio.equals(studio._id)
        );

        const totalBookedMinutes = studioBookings.reduce((acc, booking) => {
            return acc + timeToMinutes(booking.endSlot) - timeToMinutes(booking.startSlot);
        }, 0);

        const studioStart = timeToMinutes(studio.startTime);
        const studioEnd = timeToMinutes(studio.endTime);

        const totalMinutesInDay = studioEnd - studioStart;

        if (totalBookedMinutes < totalMinutesInDay) {
            studiosAvailability.push(studio);
        }
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: studiosAvailability,
    });
});

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

// Get Available Start Slots
exports.getAvailableStartSlots = asyncHandler(async (req, res, next) => {
    const { studioId, date } = req.body;

    if (!studioId || !date) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studioId and date are required"));
    }

    const studio = await StudioModel.findById(studioId);
    if (!studio) {
        return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found"));
    }

    const startOfDay = timeToMinutes(studio.startTime || "09:00");
    const endOfDay = timeToMinutes(studio.endTime || "18:00");

    const inputDate = getAllDay(date);

    const bookings = await BookingModel.find({
        studio: studioId,
        date: {
            $gte: inputDate.startOfDay,
            $lt: inputDate.endOfDay,
        },
    });

    const bookedSlots = bookings.map(book => {
        const start = timeToMinutes(book.startSlot);
        const end = timeToMinutes(book.endSlot);
        return { start, end };
    });

    const availableSlots = [];
    const now = new Date();

    for (let time = startOfDay; time < endOfDay; time += 60) {
        const slotEnd = time + 60;

        // create slot date
        const requestedDate = new Date(date);
        const slotDateTime = new Date(requestedDate);
        slotDateTime.setHours(Math.floor(time / 60), time % 60, 0, 0);

        //skip slot if it is in the past
        if (slotDateTime < now) {
            continue;
        }

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

// Get Available End Slots
exports.getAvailableEndSlots = asyncHandler(async (req, res, next) => {
    const { studioId, date, startTime, package } = req.body;

    if (!studioId || !date || !startTime, !package) {
        return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "studio, date, and start , package Time are required "));
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

    const bookings = await BookingModel.find({
        studio: studioId,
        date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
    });

    const bookedSlots = bookings.map(book => {
        const start = timeToMinutes(book.startSlot);
        const end = timeToMinutes(book.endSlot);
        return { start, end };
    });

    const startSlotMinutes = timeToMinutes(startTime);
    const endOfDay = timeToMinutes(studio.endTime || "22:00");

    const availableEndSlots = await calculateSlotPrices({
        package: selectedPackage,
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

    const allBookings = await BookingModel.find(match)
        .sort({ createdAt: -1 })

    const statusPriority = {
        pending: 0,
        approved: 1,
        rejected: 2
    };

    const filtered = allBookings.filter(b => {
        return true;
    });

    filtered.sort((a, b) => {
        const statusA = statusPriority[a.status] ?? 3;
        const statusB = statusPriority[b.status] ?? 3;

        if (statusA !== statusB) {
            return statusA - statusB;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 5. Pagination
    const paginated = filtered.slice(skip, skip + limitNum);




    // const bookings = await BookingModel.aggregate([
    //     { $match: match },

    //     // Add statusOrder
    //     {
    //         $addFields: {
    //             statusOrder: {
    //                 $switch: {
    //                     branches: [
    //                         { case: { $eq: ["$status", "pending"] }, then: 0 },
    //                         { case: { $eq: ["$status", "approved"] }, then: 1 },
    //                         { case: { $eq: ["$status", "rejected"] }, then: 2 }
    //                     ],
    //                     default: 3
    //                 }
    //             }
    //         }
    //     },

    //     // Sort first by statusOrder, then by createdAt
    //     {
    //         $sort: {
    //             statusOrder: 1,  // First, sort by status order
    //             createdAt: -1     // Then, sort by createdAt (most recent first)
    //         }
    //     },

    //     { $skip: skip },
    //     { $limit: limitNum },

    //     // Lookup for studio
    //     {
    //         $lookup: {
    //             from: 'studios',
    //             localField: 'studio',
    //             foreignField: '_id',
    //             as: 'studio'
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$studio',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },

    //     // Lookup for package.id
    //     {
    //         $lookup: {
    //             from: 'hourlypackages',
    //             localField: 'package.id',
    //             foreignField: '_id',
    //             as: 'packageDetails'
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$packageDetails',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },
    //     {
    //         $addFields: {
    //             'package.name': '$packageDetails.name',
    //             'package.price': '$packageDetails.price'
    //         }
    //     },

    //     // Unwind addOns for individual lookup
    //     {
    //         $unwind: {
    //             path: '$addOns',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'addons',
    //             localField: 'addOns.item',
    //             foreignField: '_id',
    //             as: 'addOnDetails'
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$addOnDetails',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },
    //     {
    //         $addFields: {
    //             'addOns.name': '$addOnDetails.name',
    //             'addOns.pricePerUnit': '$addOnDetails.price'
    //         }
    //     },

    //     // Group addOns back into array
    //     {
    //         $group: {
    //             _id: '$_id',
    //             doc: { $first: '$$ROOT' },
    //             addOns: { $push: '$addOns' }
    //         }
    //     },
    //     {
    //         $replaceRoot: {
    //             newRoot: {
    //                 $mergeObjects: ['$doc', { addOns: '$addOns' }]
    //             }
    //         }
    //     },

    //     // Lookup for createdBy
    //     {
    //         $lookup: {
    //             from: 'users',
    //             localField: 'createdBy',
    //             foreignField: '_id',
    //             as: 'createdBy'
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$createdBy',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     }
    // ]);

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: {
            bookings: paginated,
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
    }).populate("studio", "name");

    if (!booking) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Booking not found");
    }

    if (status === "approved") {
        // Send email to user
        const mailOptions = {
            to: booking.personalInfo.email,
            subject: "Booking Approved",
            message: changeBookingStatusEmail({ type: "approved", data: booking })
        };
        await sendEmail(mailOptions);
    }

    if (status === "rejected") {
        // Send email to user
        const mailOptions = {
            to: booking.personalInfo.email,
            subject: "Booking Rejected",
            message: changeBookingStatusEmail({ type: "rejected", data: booking })
        };
        await sendEmail(mailOptions);
    }

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: booking,
        message: "Booking status updated successfully"
    });
});

// Create New Booking
exports.createBooking = asyncHandler(async (req, res) => {
    const {
        studio: studioId,
        date,
        startSlot,
        endSlot,
        duration,
        persons,
        package: selectedPackage,
        selectedAddOns: addOns,
        personalInfo,
        totalPrice: totalPriceFromClient,
        user_id
    } = req.body;

    // Check if studio exists
    const studio = await StudioModel.findById(studioId.id);
    if (!studio) throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Studio not found for booking");

    // Check if package exists
    const pkg = await PackageModel.findById(selectedPackage.id);
    if (!pkg) throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Package not found for booking");

    const bookingDate = new Date(date);
    const startSlotMinutes = timeToMinutes(startSlot);
    const endSlotMinutes = timeToMinutes(endSlot);

    // Get all bookings for the studio on that day
    const { startOfDay, endOfDay } = getAllDay(bookingDate);
    const sameDayBookings = await BookingModel.find({
        studio: studio._id,
        date: { $gte: startOfDay, $lt: endOfDay },
    });

    // Check for conflict
    const hasConflict = sameDayBookings.some((book) => {
        const bookStart = timeToMinutes(book.startSlot);
        const bookEnd = timeToMinutes(book.endSlot);
        return startSlotMinutes < bookEnd && endSlotMinutes > bookStart;
    });

    if (hasConflict) throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "This time is already booked");

    // Studio pricing
    const bookedSlots = sameDayBookings.map((b) => ({
        start: timeToMinutes(b.startSlot),
        end: timeToMinutes(b.endSlot),
    }));

    const studioPricingResults = await calculateSlotPrices({
        studio,
        date: bookingDate,
        startSlotMinutes,
        endOfDay: timeToMinutes(endSlot),
        bookedSlots,
    });

    const lastSlot = studioPricingResults[studioPricingResults.length - 1];
    const studioPrice = lastSlot.totalPrice;
    if (studioPrice !== studioId.price) throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "the studio price is incorrect");

    // Package pricing
    let packagePrice = 0;

    if (pkg.isFixed) {
        packagePrice = pkg.price * selectedPackage.slot.endTime;
    } else {
        const packagePriceInnDb = await calculatePackagePrices({
            package: pkg,
            hours: selectedPackage.slot.endTime
        });

        packagePrice = packagePriceInnDb[packagePriceInnDb.length - 1].totalPrice
    }

    if (packagePrice !== selectedPackage.slot.totalPrice) throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "the package price is incorrect");

    // Add-on pricing
    const addonsTotalPriceFromClient = addOns?.reduce((acc, item) => {
        return acc + (item.quantity > 0 ? item.price * item.quantity : 0)
    }, 0) || 0

    const addOnDetails = [];
    let addOnsTotalPriceFromDb = 0;

    if (Array.isArray(addOns)) {
        for (const addOn of addOns) {
            const addOnItem = await AddOnModel.findById(addOn._id);
            if (!addOnItem) continue;

            const addOnPrice = addOnItem.price * addOn.quantity;
            addOnsTotalPriceFromDb += addOnPrice;

            addOnDetails.push({
                item: addOnItem._id,
                quantity: addOn.quantity,
                price: addOnItem.price,
            });
        }
    }


    // Check if total price is valid

    if (addOnsTotalPriceFromDb !== addonsTotalPriceFromClient) throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "the add-on price is incorrect");

    const totalPrice = Math.round(studioPrice + addOnsTotalPriceFromDb + packagePrice);

    if (totalPrice !== totalPriceFromClient) throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "the total price is incorrect");
    try {
        const bookingData = {
            studio: studio._id,
            date: bookingDate,
            startSlot,
            endSlot,
            duration,
            persons,
            package: {
                id: pkg._id,
                price: packagePrice,
                duration: selectedPackage.slot.endTime
            },
            addOns: addOnDetails,
            studioPrice: studioPrice,
            totalAddOnsPrice: addOnsTotalPriceFromDb,
            personalInfo,
            totalPrice,
            status: "pending",
            createdBy: user_id,
            isGuest: user_id ? false : true
        };

        const tempBooking = new BookingModel(bookingData);

        const emailOptions = {
            to: personalInfo.email,
            subject: "Booking Confirmation",
            message: bookingConfirmationEmailBody({
                ...req.body,
                bookingId: tempBooking._id,
                studio: {
                    name: studio.name,
                    image: studio.thumbnail,
                    price: studioPrice
                },
                selectedAddOns: {
                    items: [...addOns],
                    totalPrice: addOnsTotalPriceFromDb
                },
                selectedPackage: {
                    name: pkg.name,
                    price: packagePrice,
                    duration: selectedPackage.slot.endTime
                }
            }),
        };

        await sendEmail(emailOptions);

        const booking = await tempBooking.save();

        res.status(201).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            message: "Booking created successfully and sent confirmation email",
            booking
        });

    } catch (error) {
        console.log(error);
        throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to send confirmation email, booking not saved");
    }


});

// Get User Booking History
exports.getUserBookings = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const bookings = await BookingModel.find({ createdBy: _id });
    if (!bookings) res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "No bookings found",
        data: bookings
    })
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Bookings fetched successfully",
        data: bookings
    });
})
