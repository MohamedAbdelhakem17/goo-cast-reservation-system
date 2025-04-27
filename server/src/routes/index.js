const AuthRouter = require("./auth-route/auth-route");
const StudioRouter = require("./studio-route/studio-route");
const AddOnRouter = require("./add-on-route/add-on-route");
const HourlyPackageRouter = require("./hourly-package-route/hourly-package-route");
const BookingRouter = require("./booking-route/booking-route");
const AnalyticsRouter = require("./analytics-route/analytics-route");



const amountRoutes = (app) => {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/studio", StudioRouter)
    app.use("/api/v1/add-ons", AddOnRouter);
    app.use("/api/v1/hourly-packages", HourlyPackageRouter);
    app.use("/api/v1/bookings", BookingRouter);
    app.use("/api/v1/analytics", AnalyticsRouter);
   }

module.exports = amountRoutes

