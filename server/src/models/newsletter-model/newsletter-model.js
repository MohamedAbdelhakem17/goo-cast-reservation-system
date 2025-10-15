const mongoose = require("mongoose");

const newsLettersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newsLetters", newsLettersSchema);
