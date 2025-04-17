const mongoose = require("mongoose");

const priceRuleSchema = new mongoose.Schema(
    {
        studio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Studio",
            required: true,
        },

        dayOfWeek: {
            type: Number, // 0 = Sunday, 6 = Saturday
            min: 0,
            max: 6,
            default: null, // null means "all days"
        },

        isFixedHourly: {
            type: Boolean,
            default: true,
        },

        defaultPricePerSlot: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PriceRule", priceRuleSchema);
