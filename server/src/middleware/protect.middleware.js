const AppError = require("../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../config/system-variables");

const protectRoute = (req, res, next) => {
  console.log("Protecting route:", req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return next(
      new AppError(
        401,
        HTTP_STATUS_TEXT.FAIL,
        "You are not logged in. Please login first."
      )
    );
  }

  if (!req.user.active) {
    return next(
      new AppError(
        401,
        HTTP_STATUS_TEXT.FAIL,
        "Your account is not active, please contact the admin."
      )
    );
  }

  next();
};

module.exports = protectRoute;
