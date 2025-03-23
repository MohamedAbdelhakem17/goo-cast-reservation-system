require('dotenv').config(".env");
const express = require('express');
const morgan = require('morgan');
const databaseConnect = require('./config/database-connection');
const errorMiddlewareHandler = require('./middleware/error-middleware-handler');
const amountRoutes = require("./routes/index");
const AppError = require('./utils/app-error');
const { HTTP_STATUS_TEXT } = require('./config/system-variables');
const app = express();


// database connection;
databaseConnect();

// Middleware
if (process.env.ENVIRONMENT_MODE === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

//AMOUNT ROUTES
amountRoutes(app);

// Handel Not Found Route Middleware
app.use("*", (req, res) => {
    throw new AppError(404, HTTP_STATUS_TEXT.ERROR, `This route ${req.hostname} not found. Please try another one.`);
});

// Handel Error Middleware
app.use(errorMiddlewareHandler);

const server = app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.name} | ${error.message}`);
    server.close(() => {
        console.log("Server shutting down...");
        process.exit(1);
    });
});