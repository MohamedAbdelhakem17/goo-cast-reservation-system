const mongoose = require("mongoose");

const faqSchema = mongoose.Schema(
  {
    question: {
      en: {
        type: String,
        required: [true, "Please provide a question in english"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Please provide a question in arabic"],
        trim: true,
      },
    },

    answer: {
      en: {
        type: String,
        required: [true, "Please provide a answer in english"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Please provide a answer arabic"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Faqs", faqSchema);
