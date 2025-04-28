const mongoose = require("mongoose");
const slugify = require("slugify");

const studioSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            maxLength: [50, "Name must be less than 50 characters"],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        address: {
            type: String,
            required: [true, "Please provide an address"],
            trim: true,
            maxLength: [100, "Address must be less than 100 characters"],
        },

        basePricePerSlot: {
            type: Number,
            default: 0,
            min: [0, "Base price must be greater than or equal to 0"],
        },

        isFixedHourly: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            required: [true, "Please provide a description"],
            trim: true,
        },

        facilities: {
            type: [String],
            validate: [(arr) => arr.length > 0, "At least one facility is required"],
        },

        equipment: {
            type: [String],
            validate: [
                (arr) => arr.length > 0,
                "At least one equipment item is required",
            ],
        },

        thumbnail: {
            type: String,
            required: [true, "Please provide a thumbnail"],
            trim: true,
        },

        imagesGallery: {
            type: [String],
            validate: [
                {
                    validator: function (val) {
                        return val.length > 0;
                    },
                    message: "At least one image is required.",
                },
                {
                    validator: function (val) {
                        return val.length <= 5;
                    },
                    message: "You can upload a maximum of 5 images.",
                },
            ],
            required: true,
        },

        startTime: {
            type: String,
            default: "09:00",
        },

        endTime: {
            type: String,
            default: "18:00",
        },

        minSlotsPerDay: {
            type: Object,
            default: {
                sunday: 1,
                monday: 1,
                tuesday: 1,
                wednesday: 1,
                thursday: 1,
                friday: 1,
                saturday: 1,
            },
        },

        dayOff: {
            type: [String],
            default: [],
            validate: {
                validator: function (val) {
                    const allowedDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    return val.every(day => allowedDays.includes(day));
                },
                message: "Invalid day in dayOff array",
            }
        }

    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Auto-generate slug from name before saving
studioSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }

    validateTimeRange(this.startTime, this.endTime);

    next();
});

studioSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    const startTime = update.startTime || this.get("startTime");
    const endTime = update.endTime || this.get("endTime");
    const dayOff = update.dayOff || this.get("dayOff");
    const minSlotsPerDay = update.minSlotsPerDay || this.get("minSlotsPerDay");

    validateTimeRange(startTime, endTime);

    next();
});

studioSchema.post("save", (doc) => {
    setImage(doc);
});

studioSchema.post("init", (doc) => {
    setImage(doc);
});

// Helper: Validate startTime < endTime
function validateTimeRange(start, end) {
    if (start && end) {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        if (sh > eh || (sh === eh && sm >= em)) {
            throw new Error("Start time must be before end time.");
        }
    }
}

// Set full image URLs
function setImage(doc) {
    if (doc.thumbnail) {
        doc.thumbnail = `${process.env.BASE_URL}/uploads/studio/${doc.thumbnail}`;
    }

    if (doc.imagesGallery) {
        doc.imagesGallery = doc.imagesGallery.map(
            (img) => `${process.env.BASE_URL}/uploads/studio/${img}`
        );
    }
};

module.exports = mongoose.model("Studio", studioSchema);

