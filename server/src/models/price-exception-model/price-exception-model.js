const mongoose = require("mongoose");

const priceExceptionSchema = new mongoose.Schema(
    {
        package: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Studio",
            type: mongoose.Schema.Types.ObjectId,
            ref: "HourlyPackage",
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

        defaultPricePerSlot: {
            type: Number,
            min: 0,
        },

        perSlotDiscounts: {
            type: Map,
            of: Number,
            default: {}
        }
    },

    { timestamps: true }
);


module.exports = mongoose.model("PriceException", priceExceptionSchema);
