const mongoose = require("mongoose");

const priceExceptionSchema = new mongoose.Schema(
    {
        studio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Studio",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        isFixedHourly: {
            type: Boolean,
            default: true,
        },

        overridePricePerSlot: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PriceException", priceExceptionSchema);
