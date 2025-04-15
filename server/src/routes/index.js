const AuthRouter = require("./auth-route/auth-route");
const StudioRouter = require("./studio-route/studio-route");

const home = async (req, res) => {
    res.status(200).json({
        message: "Welcome to Amount API",
        status: "success",
        data: {
            name: "Amount API",
            version: "1.0.0",
        }
    });
}


const amountRoutes = (app) => {
    app.use("/api/v1/home", home);
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/studio", StudioRouter)
}

module.exports = amountRoutes

