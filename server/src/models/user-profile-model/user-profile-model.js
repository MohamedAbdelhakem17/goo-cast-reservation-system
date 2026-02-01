const mongoose = require("mongoose");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

//
// ────────────────────────────────────────────────
//   User Activity Sub schema
// ────────────────────────────────────────────────
//
const userActivitySchema = new mongoose.Schema(
  {
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastBookingTime: {
      type: Date,
      default: null,
    },
    totalBookingTimes: {
      type: Number,
      default: 0,
      min: 0,
    },
    nextBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    allUserBooking: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
    ],
  },
  { _id: false }
);

//
// ────────────────────────────────────────────────
//   Main User Profile Schema
// ────────────────────────────────────────────────
//
const userProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [14, "First name must be less than 15 characters"],
    },

    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required"],
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [14, "Last name must be less than 15 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (value) {
          if (!value) return false;

          const allowedCountries = ["eg", "sa", "ae"];

          // Remove all non-digit characters except leading +
          let cleanValue = value.replace(/[^\d+]/g, "");

          // If doesn't start with +, check if it already has a country code
          if (!cleanValue.startsWith("+")) {
            // Check if it starts with known country codes (20, 966, 971)
            if (cleanValue.startsWith("20")) {
              cleanValue = "+" + cleanValue;
            } else if (cleanValue.startsWith("966")) {
              cleanValue = "+" + cleanValue;
            } else if (cleanValue.startsWith("971")) {
              cleanValue = "+" + cleanValue;
            } else {
              // No country code detected, add default Egypt country code
              // Remove leading zeros
              cleanValue = cleanValue.replace(/^0+/, "");
              cleanValue = "+20" + cleanValue;
            }
          }

          try {
            const phoneNumber = parsePhoneNumberFromString(cleanValue);
            if (!phoneNumber) return false;

            // Validate the phone number is valid and from allowed countries
            const countryCode = phoneNumber.country?.toLowerCase();
            return (
              phoneNumber.isValid() &&
              countryCode &&
              allowedCountries.includes(countryCode)
            );
          } catch {
            return false;
          }
        },
        message: "Phone number is not valid. Only Egypt (+20), Saudi Arabia (+966), and UAE (+971) numbers are accepted.",
      },
    },

    tags: {
      type: [String],
      default: ["New User"],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: "Tags must be an array of strings",
      },
    },

    avatar: {
      type: String,
    },

    accountOwner: {
      type: String,
      required: false,
    },

    userActivity: {
      type: userActivitySchema,
      default: () => ({}),
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//
// ────────────────────────────────────────────────
//   Virtuals
// ────────────────────────────────────────────────
//

// Full name (computed, not stored)
userProfileSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//
// ────────────────────────────────────────────────
//   Pre Save Hook (auto-generate avatar & account owner)
// ────────────────────────────────────────────────
//
userProfileSchema.pre("save", function (next) {
  if (this.isModified("firstName") || this.isModified("lastName")) {
    const first = this.firstName?.trim()?.charAt(0) || "";
    const last = this.lastName?.trim()?.charAt(0) || "";

    this.avatar = (first + last).toUpperCase();
    this.accountOwner = this.firstName;
  }

  next();
});

//
// ────────────────────────────────────────────────
//   Schema Methods
// ────────────────────────────────────────────────
//

// Increment booking count and update activity
userProfileSchema.methods.recordBooking = function (
  bookingId,
  bookingDate = new Date(),
  amountSpent = 0
) {
  this.userActivity.totalBookingTimes += 1;
  this.userActivity.lastBookingTime = bookingDate;
  this.userActivity.totalSpent += amountSpent;
  this.userActivity.nextBooking = bookingId;

  if (!this.userActivity.allUserBooking.includes(bookingId)) {
    this.userActivity.allUserBooking.push(bookingId);
  }
};

userProfileSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "userActivity.allUserBooking",
      select:
        "totalPrice totalPriceAfterDiscount studio status package duration date",
      populate: [
        { path: "studio", select: "name thumbnail" },
        { path: "package", select: "name price" },
      ],
      options: { noUserPopulate: true },
    },
    {
      path: "userActivity.nextBooking",
      select:
        "totalPrice status totalPriceAfterDiscount studio package duration date startSlot endSlot",
      populate: [
        { path: "studio", select: "name thumbnail" },
        { path: "package", select: "name price" },
      ],
      options: { noUserPopulate: true },
    },
  ]);
  next();
});

//
// ────────────────────────────────────────────────
//   Export Model
// ────────────────────────────────────────────────
//
module.exports = mongoose.model("UserProfile", userProfileSchema);
