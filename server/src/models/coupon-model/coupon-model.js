const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Please provide a discount code"],
      trim: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: [true, "Please provide a discount percentage"],
      min: [0, "Discount percentage must be a positive number"],
    },
    expires_at: {
      type: Date,
      required: [true, "Please provide an expiration date"],
    },
    max_uses: {
      type: Number,
      required: [true, "Please provide a maximum number of uses"],
      min: [0, "Max uses must be a positive number"],
    },
    times_used: {
      type: Number,
      default: 0,
      min: [0, "Times used must be a positive number"],
    },
    user_id_used: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user_email_used: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
