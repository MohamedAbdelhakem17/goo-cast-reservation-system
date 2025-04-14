const errorMiddlewareHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const statusText = error.statusText || 'error';
    const message = error.message || 'Internal Server Error';

    if (process.env.ENVIRONMENT_MODE === 'development') {
        res.status(statusCode).json({
            status: statusText,
            message: message,
            stack: error.stack
        });
    }
}

module.exports = errorMiddlewareHandler

  