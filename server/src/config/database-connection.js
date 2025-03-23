const mongoose = require("mongoose");

const databaseConnect = async () => {
    await mongoose
        .connect(process.env.DATABASE_CONNECTION_STRING)
        .then((connection) => {
            console.log(
                `Database Connect Successfully : ${connection.connection.host}`
            );
        });
};

module.exports = databaseConnect;
