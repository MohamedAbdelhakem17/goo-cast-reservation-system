// ====== Load Environment Variables ======
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

// ====== Imports ======
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const databaseConnect = require("./config/database-connection");
const errorMiddlewareHandler = require("./middleware/error-middleware-handler");
const amountRoutes = require("./routes/index");
const AppError = require("./utils/app-error");
const { HTTP_STATUS_TEXT } = require("./config/system-variables");

// ====== App Initialization ======
const app = express();

// ====== Database Connection ======
databaseConnect();

// ====== Middleware ======
if (process.env.ENVIRONMENT_MODE === "development") {
  app.use(morgan("dev"));
}

// Security headers
// app.use(helmet());

// Body parser
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.ENVIRONMENT_MODE !== "development",
      sameSite:
        process.env.ENVIRONMENT_MODE === "development" ? "lax" : "strict",
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ====== API Routes ======
amountRoutes(app);

// ====== Serve Static Uploads ======
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ====== Serve React Frontend ======
const clientDistPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// ====== Not Found Handler ======
app.use("*", (req, res, next) => {
  next(
    new AppError(
      404,
      HTTP_STATUS_TEXT.ERROR,
      `This route ${req.originalUrl} not found.`
    )
  );
});

// ====== Global Error Handler ======
app.use(errorMiddlewareHandler);

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port: ${PORT} in ${process.env.ENVIRONMENT_MODE} mode`
  );
});

// ====== Handle Unhandled Promise Rejections ======
process.on("unhandledRejection", (error) => {
  console.error(`❌ Unhandled Rejection: ${error.name} | ${error.message}`);
  server.close(() => process.exit(1));
});
