const AppError = require('../utils/app-error');
const { HTTP_STATUS_TEXT } = require('../config/system-variables');
const allowTo = (...roles) => (req, res, next) => {


    if (!roles.includes(req.user.role)) {
        throw new AppError(403, HTTP_STATUS_TEXT.FAIL, "You are not allowed to access this route");
    }
    next();
};

module.exports = allowTo;