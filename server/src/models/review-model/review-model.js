const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  placeId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  lastUpdated: { type: Date, default: Date.now },
  userRatingsTotal: { type: Number },
});

module.exports = mongoose.model("googleReview", ReviewSchema);
