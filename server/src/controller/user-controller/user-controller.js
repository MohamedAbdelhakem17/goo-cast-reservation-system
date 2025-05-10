const asyncHandler = require('express-async-handler');

const AppError = require('../../utils/app-error');
const { getAllDay } = require('../../utils/time-mange');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');
const AuthModel = require('../../models/user-model/user-model');
const BookingModel = require('../../models/booking-model/booking-model');


// Get User Data  
exports.getUserData = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;

    const userData = await AuthModel.findById(_id, { email: 1, name: 1, phone: 1 });
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: userData
    })
})

// Edit User Data
exports.updateUserData = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { name, phone } = req.body;
    if (!name || !phone) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    const updateFields = { name, phone };
    const userData = await AuthModel.findByIdAndUpdate(_id, updateFields, { new: true });

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "User data updated successfully",
        data: userData
    })
})

// Edit Login User Password
exports.editLoginUserPassword = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { password, confirmPassword, currentPassword } = req.body;

    const user = await AuthModel.findById(_id);
    const isCorrectPassword = await user.comparePassword(currentPassword);

    if (!isCorrectPassword) {
        throw new AppError(401, HTTP_STATUS_TEXT.FAIL, "Invalid credentials please try again and check your current password");
    }

    if (!password || !confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    if (password !== confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
    }

    user.password = password;

    await user.save();
    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Password updated successfully",
        data: user
    })
})

// Get User Stats
exports.getUserStats = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { startOfDay } = getAllDay(new Date());

    // Find the last booking before today
    const lastBookingBeforeToday = await BookingModel.find({
        createdBy: _id,
        status: "approved",
        date: { $lt: startOfDay }
    }).sort({ date: -1 }).limit(1);

    // Find The Next Booking After Today
    const nextBookingAfterToday = await BookingModel.find({
        createdBy: _id,
        status: "approved",
        date: { $gt: startOfDay }
    }).sort({ date: 1 }).limit(1);

    // Find most Studio Booked 
    const mostStudioBooked = await BookingModel.find({
        createdBy: _id,
        status: "approved"
    }).sort({ studio: -1 }).limit(1);

    // Find Total Bookings For Most Studio Booked
    const totalBookings = await BookingModel.countDocuments({
        createdBy: _id,
        studio: mostStudioBooked._id,
        status: "approved"
    });


    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: {
            lastBookingBeforeToday,
            nextBookingAfterToday,
            mostStudioBooked: {
                studio: mostStudioBooked[0]?.studio,
                count: totalBookings
            }
        }
    });
});
