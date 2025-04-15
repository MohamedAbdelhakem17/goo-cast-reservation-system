const jwt = require('jsonwebtoken');
const { HTTP_STATUS_TEXT } = require('../config/system-variables');
const AppError = require('../utils/app-error');
const AuthModel = require('../models/user-model/user-model');

const protectRoute = async (req, res, next) => {
    // Check if the user is authenticated
    const authorizationHeader = req.header('authorization') || req.header('Authorization');
    console.log(authorizationHeader);
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
        throw new AppError(401, HTTP_STATUS_TEXT.FAIL, "You are not logged in please login first");
    }

    // Verify the JWT token  
    const token = authorizationHeader.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await AuthModel.findById(decodedToken.id);

    // Check if the user exists
    if (!user) {
        throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "The user that belongs to this token no longer exists.")
    }

    console.log(user);

    req.user = user;

    next();
};

module.exports = protectRoute;