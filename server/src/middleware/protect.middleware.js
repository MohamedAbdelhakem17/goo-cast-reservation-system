const jwt = require('jsonwebtoken');
const { HTTP_STATUS_TEXT } = require('../config/system-variables');
const AppError = require('../utils/app-error');
const AuthModel = require('../models/user-model/user-model');

const protectRoute = async (req, res, next) => {
    try {
        // Check if the user is authenticated
        const authorizationHeader = req.header('authorization') || req.header('Authorization');
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
            return next(new AppError(401, HTTP_STATUS_TEXT.FAIL, "You are not logged in please login first"));
        }

        // Verify the JWT token  
        const token = authorizationHeader.split(' ')[1];

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return next(new AppError(400, HTTP_STATUS_TEXT.FAIL, "Invalid token"));
        }

        const user = await AuthModel.findById(decodedToken.id);

        // Check if the user exists
        if (!user) {
            return next(new AppError(404, HTTP_STATUS_TEXT.FAIL, "The user that belongs to this token no longer exists."));
        }

        req.user = user;
        next();

    } catch (error) {
        next(new AppError(500, HTTP_STATUS_TEXT.FAIL, "Internal Server Error"));
    }
};

module.exports = protectRoute;