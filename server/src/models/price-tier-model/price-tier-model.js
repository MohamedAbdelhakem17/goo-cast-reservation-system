const mongoose = require("mongoose");

const priceTierSchema = new mongoose.Schema(
    {
        priceRule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PriceRule",
            required: true,
        },

        minSlots: {
            type: Number,
            required: true,
            min: 1,
        },

        maxSlots: {
            type: Number,
            required: false, 
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        exception: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PriceException",
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("PriceTier", priceTierSchema);
