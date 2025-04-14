const asyncHandler = require('express-async-handler');

const generateToken = require('../../utils/create-token');
const AppError = require('../../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../../config/system-variables');
const AuthModel = require('../../models/user-model/user-model');


// sIgnup function to handle user registration
exports.signup = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "All fields are required");
    }

    // Check if the email already exists
    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
        throw new AppError(409, HTTP_STATUS_TEXT.FAIL, "This email already exists");
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        throw new AppError(400, HTTP_STATUS_TEXT.FAIL, "Passwords do not match");
    }

    // Create the user
    const newUser = await AuthModel.create({
        name,
        email,
        password,
    });

    if (newUser) {
        res.status(201).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            data: "User created successfully",
        });
    } else {
        throw new AppError(500, HTTP_STATUS_TEXT.FAIL, "Failed to create user");
    }

})

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
    const token = generateToken({ id: user._id },"1 * 60 * 5); ");
    

    // send email with password reset link (pseudo code)

    res.status(200).json({
        status: HTTP_STATUS_TEXT.SUCCESS,
        message: "Password reset link sent successfully",
    });
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