const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
    },

    timeSpent: {
        type: Number,
        required: true,
    },

    timestamp: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);