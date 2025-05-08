const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HourlyPackage",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        }
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
            }
        }
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

    studioPrice: {
        type: Number,
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    isGuest: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

bookingSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: "studio",
            select: "name thumbnail address",
        },
        {
            path: "package.id",
            select: "name price",
        },
        {
            path: "addOns.item",
            select: "name price",
        },
        {
            path: "createdBy",
            select: "fullName email",
        }
    ]);
    next();
});

module.exports = mongoose.model("Booking", bookingSchema);
