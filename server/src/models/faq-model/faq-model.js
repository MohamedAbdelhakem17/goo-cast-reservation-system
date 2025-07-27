const mongoose = require("mongoose");

const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Please provide a question"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Please provide a answer"],
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Faqs", faqSchema);
