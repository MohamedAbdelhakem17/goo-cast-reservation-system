const mongoose = require("mongoose");

const HourlyPackageSchema = new mongoose.Schema({
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
    details: {
        type: [String],
        required: [true, "Please provide details"],
        set: arr => arr.map(s => s.trim()),
    },
    prices: {
        twoHours: {
            type: Number,
            required: [true, "Please provide a price"],
            min: [0, "Price must be a positive number"],
        },
        halfDay: {
            type: Number,
            required: [true, "Please provide a price"],
            min: [0, "Price must be a positive number"],
        },
        fullDay: {
            type: Number,
            required: [true, "Please provide a price"],
            min: [0, "Price must be a positive number"],
        },
    },
    savings: {
        halfDay: {
            type: Number,
            required: [true, "Please provide a saving"],
            min: [0, "Saving must be a positive number"],
        },
        fullDay: {
            type: Number,
            required: [true, "Please provide a saving"],
            min: [0, "Saving must be a positive number"],
        },
    },
    icon: String,
});

module.exports = mongoose.model("HourlyPackage", HourlyPackageSchema);
