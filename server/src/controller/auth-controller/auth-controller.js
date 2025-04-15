const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const generateToken = require('../../utils/create-token');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');
const AuthModel = require('../../models/user-model/user-model');

const sendEmail = require('../../utils/send-email');
const generateEmailTemplate = require('../../utils/generate-email-template');

// create token for activation
const generateActivationEmail = (userId, email, type) => {
    const token = generateToken({ id: userId }, "5m");

    const mailOptions = {
        to: email,
        subject: "Activate your account",
        message: generateEmailTemplate({ type, token, baseUrl: process.env.BASE_URL }),
    };

    return mailOptions;
};

// sIgnup function to handle user registration
exports.signup = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await AuthModel.findOne({ email });

    if (existingUser && !existingUser.active) {
        // Generate token and send activation email again
        const mailOptions = generateActivationEmail(existingUser._id, existingUser.email, "activate",);
        try {
            await sendEmail(mailOptions);
            return res.status(200).json({
                status: HTTP_STATUS_TEXT.SUCCESS,
                data: "User already exists. Activation link resent to your email.",
            });
        } catch (error) {
            console.log(error);
            throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to send email");
        }
    } else if (existingUser) {
        throw new AppError(409, HTTP_STATUS_TEXT.FAIL, "User already exists");
    }

    // Create new user
    const newUser = await AuthModel.create({ name, email, password });

    // Generate token and send activation email
    const mailOptions = generateActivationEmail(newUser._id, email, "activate");


    try {
        await sendEmail(mailOptions);
        return res.status(201).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            data: "User created successfully. Activation link sent to your email.",
        });
    } catch (error) {
        throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to send email");
    }
});

// activate email function to handle user activation
exports.activateEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by token
    const user = await AuthModel.findById(decodedToken.id);

    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
    }

    // Update the user's activation status
    user.active = true;
    await user.save();

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        data: "User activated successfully",
    });
});

// resend activation email
exports.resendActivationLink = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Email is required");
    }

    const user = await AuthModel.findOne({ email });

    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
    }

    // Generate token and mail options
    const { mailOptions } = generateActivationEmail(user._id, email, "activate");

    try {
        await sendEmail(mailOptions);
        res.status(200).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            data: "Activation link resent to your email.",
        });
    } catch (error) {
        throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to send activation email");
    }
});

// signin function to handle user login
exports.signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    // Find the user by email
    const user = await AuthModel.findOne({ email });

    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new AppError(401, HTTP_STATUS_TEXT.FAIL, "Invalid credentials");
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    // Set the JWT token in a cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "User signed in successfully",
    });
})

// signout function to handle user logout
exports.signout = asyncHandler(async (req, res) => {
    // Clear the JWT token from the cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "User signed out successfully",
    });
})

// resetPassword function to handle password reset
exports.resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Email is required");
    }

    // Find the user by email
    const user = await AuthModel.findOne({ email });
    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
    }

    // Generate JWT token for password reset
    const mailOptions = generateActivationEmail(user._id, email, "reset");

    try {
        await sendEmail(mailOptions);
        res.status(200).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            message: "Password reset link sent successfully",
        });
    } catch (error) {
        throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to send email");
    }
})

// updatePassword function to handle password update
exports.updatePassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword, token } = req.body;

    // check if the token is valid (pseudo code)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
        throw new AppError(401, HTTP_STATUS_TEXT.FAIL, "Invalid token");
    }
    // Validate required fields
    if (!password || !confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
    }

    // Find the user by id
    const user = await AuthModel.findById(decodedToken.id);
    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
    }

    // Update the password
    user.password = password;
    await user.save();

    // logout the user by clearing the JWT token from the cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Password updated successfully",
    });
})