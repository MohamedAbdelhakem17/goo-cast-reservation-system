const home = async (req, res) => {
    res.status(200).json({
        message: "Welcome to Amount API",
        status: "success",
    });
}

const amountRoutes = (app) => {
    app.use("/api/v1/home", home);
}

module.exports = amountRoutes

