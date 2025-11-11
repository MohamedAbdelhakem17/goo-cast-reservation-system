const AppError = require("../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../config/system-variables");
const hasPermission = require("../utils/access-roles");

const allowPolicy = (policy) => (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError(401, HTTP_STATUS_TEXT.FAIL, "User not logged in.")
    );
  }

  if (!hasPermission(req.user.role, policy)) {
    return next(
      new AppError(403, HTTP_STATUS_TEXT.FAIL, "You do not have permission.")
    );
  }

  next();
};

module.exports = allowPolicy;
