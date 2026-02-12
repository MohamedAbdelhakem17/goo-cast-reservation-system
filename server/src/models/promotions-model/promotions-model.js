const mongoose = require("mongoose");
const validatePromotionDates = require("../../utils/validate-promotion-dates");

const promotionSchema = new mongoose.Schema(
  {
    title: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },

    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },

    isEnabled: { type: Boolean, default: true },

    description: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },

    priority: { type: Number, default: 0 },

    hasLink: { type: Boolean, default: false },

    link: {
      type: String,
    },

    hasTimer: { type: Boolean, default: false },
  },
  { timestamps: true },
);

promotionSchema.pre("validate", function (next) {
  const error = validatePromotionDates(this.start_date, this.end_date);
  if (error) this.invalidate("start_date", error);
  next();
});

promotionSchema.index({
  start_date: 1,
  end_date: 1,
  isEnabled: 1,
  priority: 1,
});

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
