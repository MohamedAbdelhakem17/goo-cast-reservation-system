const errorMiddlewareHandler = (error, req, res, next) => {
    const { statusCode, statusText, message, stack } = error
    if (process.env.ENVIRONMENT_MODE === 'development') {
        res.status(statusCode).json({
            status: statusText,
            message: message,
            stack: stack
        });
    }
}

module.exports = errorMiddlewareHandler