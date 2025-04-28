const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

const databaseConnect = require('./config/database-connection');
const errorMiddlewareHandler = require('./middleware/error-middleware-handler');
const amountRoutes = require("./routes/index");
const AppError = require('./utils/app-error');
const { HTTP_STATUS_TEXT } = require('./config/system-variables');

const app = express();

// ====== Database Connection ======
databaseConnect();

// ====== Middleware ======
if (process.env.ENVIRONMENT_MODE === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors("*"));

// ====== API Routes ======
amountRoutes(app);

// ====== Serve Uploads Folder ======
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ====== Serve React Frontend ======
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req, res, next) => {
    const filePath = path.join(__dirname, '../../client/dist/index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            next(err);
        }
    });
});

// ====== Not Found Middleware ======
app.use("*", (req, res) => {
    throw new AppError(404, HTTP_STATUS_TEXT.ERROR, `This route ${req.hostname} not found. Please try another one.`);
});

// ====== Error Handler Middleware ======
app.use(errorMiddlewareHandler);

// ====== Start Server ======
const server = app.listen(process.env.PORT, () => {
    console.log('Server is running on port: ' + process.env.PORT);
});

// ====== Handle Unhandled Promise Rejections ======
process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.name} | ${error.message}`);
    server.close(() => {
        console.log("Server shutting down...");
        process.exit(1);
    });
});
