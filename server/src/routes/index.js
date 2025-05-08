const AuthRouter = require("./auth-route/auth-route");
const StudioRouter = require("./studio-route/studio-route");
const AddOnRouter = require("./add-on-route/add-on-route");
const HourlyPackageRouter = require("./hourly-package-route/hourly-package-route");
const BookingRouter = require("./booking-route/booking-route");
const AnalyticsRouter = require("./analytics-route/analytics-route");
const PriceRuleRouter = require("./price-rule-route/price-rule-route");
const PriceExceptionRouter = require("./price-exception-route/price-exception-route");
const CategoryRouter = require("./category-route/category-route");


const amountRoutes = (app) => {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/studio", StudioRouter);
    app.use("/api/v1/add-ons", AddOnRouter);
    app.use("/api/v1/hourly-packages", HourlyPackageRouter);
    app.use("/api/v1/bookings", BookingRouter);
    app.use("/api/v1/analytics", AnalyticsRouter);
    app.use("/api/v1/price-rules", PriceRuleRouter);
    app.use("/api/v1/price-exceptions", PriceExceptionRouter);
    app.use("/api/v1/categories", CategoryRouter);

    // Error handling and sending email
    app.use("/api/v1/error-notification", require("./email-error").SendEmailRoute);
};

module.exports = amountRoutes;

