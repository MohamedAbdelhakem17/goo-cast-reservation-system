const mongoose = require("mongoose");
const priceRuleSchema = new mongoose.Schema({
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
    },
    dayOfWeek: {
        type: Number, // 0 = Sunday
        default: null
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
});


module.exports = mongoose.model("PriceRule", priceRuleSchema);
