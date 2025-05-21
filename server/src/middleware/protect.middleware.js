const jwt = require("jsonwebtoken");
const { HTTP_STATUS_TEXT } = require("../config/system-variables");
const AppError = require("../utils/app-error");
const AuthModel = require("../models/user-model/user-model");

const protectRoute = async (req, res, next) => {

  if (!req.isAuthenticated()) {
    return next(
      new AppError(
        401,
        HTTP_STATUS_TEXT.FAIL,
        "You are not logged in please login first"
      )
    );
  }
  
  const user = await AuthModel.findById(req.user._id);

  if (!user) {
    return next(
      new AppError(
        404,
        HTTP_STATUS_TEXT.FAIL,
        "The user that belongs to this token no longer exists."
      )
    );
  }

  if (user.active === false) {
    return next(
      new AppError(
        401,
        HTTP_STATUS_TEXT.FAIL,
        "Your account is not active please contact the admin"
      )
    );
  }

  req.user = user;
  next();
};

module.exports = protectRoute;
