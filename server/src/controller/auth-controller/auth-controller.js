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

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthModel.findById(decodedToken.id);

        if (!user) {
            throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "User not found");
        }

        if (user.active) {
            return res.status(400).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Already Active</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #ece9e6, #ffffff);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #2c3e50;
        }
        .card {
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            text-align: center;
            max-width: 400px;
        }
        .card h1 { color: #e74c3c; font-size: 24px; margin-bottom: 12px; }
        .card p { color: #555; margin-bottom: 24px; }
        .card a {
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
        }
        .card a:hover { background-color: #0056b3; }
    </style>
    <script>
        setTimeout(() => { window.location.href = "/"; }, 2000);
    </script>
</head>
<body>
    <div class="card">
        <h1>Email Already Active</h1>
        <p>Your email is already activated. Redirecting to home...</p>
        <a href="/">Go to Home Now</a>
    </div>
</body>
</html>`);
        }

        // Activate and save
        user.active = true;
        await user.save();

        // Redirect after success
        res.send(`
        <html>
          <head>
            <script>
              localStorage.setItem("emailActivated", "true");
              window.location.href = "/";
            </script>
          </head>
          <body>
            Redirecting...
          </body>
        </html>`);
    } catch (err) {
        // Handle token expiration specifically
        if (err.name === "TokenExpiredError") {
            return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Activation Link Expired</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #2c3e50;
                    }
                    .card {
                        background: #fff;
                        padding: 40px;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                        text-align: center;
                        max-width: 400px;
                    }
                    .card h1 { color: #e67e22; font-size: 24px; margin-bottom: 12px; }
                    .card p { color: #555; margin-bottom: 24px; }
                    .card input {
                        padding: 10px;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        width: 100%;
                        margin-bottom: 12px;
                    }
                    .card button {
                        padding: 10px 16px;
                        background-color: #28a745;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    }
                    .card button:hover {
                        background-color: #218838;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Activation Link Expired</h1>
                    <p>Your activation link has expired. Please enter your email to resend the activation link.</p>
                    <input type="email" id="emailInput" placeholder="Enter your email" />
                    <button onclick="resendActivation()">Resend Activation Link</button>
                    <p id="responseMsg" style="margin-top: 12px;"></p>
                </div>
                <script>
                    function resendActivation() {
                        const email = document.getElementById('emailInput').value;
                        fetch('/api/v1/auth//resend-activation-link', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email })
                        })
                        .then(res => res.json())
                        .then(data => {
                            document.getElementById('responseMsg').textContent = data.message || 'Check your inbox!';
                        })
                        .catch(() => {
                            document.getElementById('responseMsg').textContent = 'Error sending activation link.';
                        });
                    }
                </script>
            </body>
            </html>
            `);
        }

        // Fallback for other JWT errors
        return res.status(400).json({
            status: "fail",
            message: "Invalid or expired token"
        });
    }
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

    if (user.active) {
        return res.status(400).json({
            status: HTTP_STATUS_TEXT.FAIL,
            message: "User already activated",
        });
    }

    // Generate token and mail options
    const mailOptions = generateActivationEmail(user._id, email, "activate");

    try {
        await sendEmail(mailOptions);
        res.status(200).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            data: "Activation link resent to your email.",
        });
    } catch (error) {
        console.log(error);
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
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        },
        message: "User signed in successfully",

    });
})


// Signout function to handle user logout
exports.signout = asyncHandler(async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({
            status: HTTP_STATUS_TEXT.SUCCESS,
            message: "User signed out successfully",
        });

    } catch (error) {
        res.status(500).json({
            status: HTTP_STATUS_TEXT.ERROR,
            message: "Failed to sign out user",
            error: error.message
        });
    }
});


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