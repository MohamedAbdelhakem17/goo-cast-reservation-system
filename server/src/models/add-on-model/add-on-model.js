// models/AddOn.js
const mongoose = require("mongoose");

const AddOnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        min: [0, "Price must be a positive number"],
    },
    icon: String,
});

module.exports = mongoose.model("AddOn", AddOnSchema);
