const mongoose = require("mongoose");
const { validate } = require("../hourly-packages-model/hourly-packages-model");
const { PAYMENT_METHOD } = require("../../config/system-variables");

const bookingSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startSlot: {
      type: String,
      required: true,
    },

    endSlot: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    persons: {
      type: Number,
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HourlyPackage",
      required: true,
    },

    addOns: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AddOn",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    personalInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        match: /.+\@.+\..+/,
      },
      brand: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    totalAddOnsPrice: {
      type: Number,
      required: true,
    },

    totalPackagePrice: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isGuest: {
      type: Boolean,
      default: false,
    },
    startSlotMinutes: { type: Number, required: true },
    endSlotMinutes: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHOD.CARD, PAYMENT_METHOD.CASH],
      default: PAYMENT_METHOD.CARD,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentAt: {
      type: Date,
      default: null,
    },

    opportunityID: {
      type: String,
    },

    eventID: {
      type: String,
    },

    totalPriceAfterDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value <= this.totalPrice;
        },
        message:
          "Total price after discount must be less than or equal to total price.",
      },
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "studio",
      select: "name thumbnail address basePricePerSlot",
    },
    {
      path: "package",
      select: "name price",
    },
    {
      path: "addOns.item",
      select: "name price",
    },
    {
      path: "createdBy",
      select: "fullName",
    },
  ]);
  next();
});

bookingSchema.post("save", async function (doc, next) {
  await doc.populate([
    {
      path: "studio",
      select: "name thumbnail address",
    },
    {
      path: "package",
      select: "name",
    },
    {
      path: "addOns.item",
      select: "name price",
    },
    {
      path: "createdBy",
      select: "fullName email",
    },
  ]);

  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
