const mongoose = require("mongoose");
const slugify = require("slugify");

const studioSchema = new mongoose.Schema(
  {
    name: {
      ar: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        maxLength: [50, "Name must be less than 50 characters"],
      },
      en: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        maxLength: [50, "Name must be less than 50 characters"],
      },
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
      ar: {
        type: String,
        required: [true, "Please provide an address"],
        trim: true,
        maxLength: [100, "Address must be less than 100 characters"],
      },
      en: {
        type: String,
        required: [true, "Please provide an address"],
        trim: true,
        maxLength: [100, "Address must be less than 100 characters"],
      },
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
      ar: {
        type: String,
        required: [true, "Please provide a description"],
        trim: true,
      },
      en: {
        type: String,
        required: [true, "Please provide a description"],
        trim: true,
      },
    },
    facilities: {
      ar: {
        type: [String],
        validate: [
          (arr) => arr.length > 0,
          "At least one facility is required",
        ],
      },
      en: {
        type: [String],
        validate: [
          (arr) => arr.length > 0,
          "At least one facility is required",
        ],
      },
    },
    equipment: {
      ar: {
        type: [String],
        validate: [
          (arr) => arr.length > 0,
          "At least one equipment item is required",
        ],
      },
      en: {
        type: [String],
        validate: [
          (arr) => arr.length > 0,
          "At least one equipment item is required",
        ],
      },
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a thumbnail"],
      trim: true,
    },
    live_view: {
      type: String,
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
            return val.length <= 10;
          },
          message: "You can upload a maximum of 10 images.",
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
          const allowedDays = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          return val.every((day) => allowedDays.includes(day));
        },
        message: "Invalid day in dayOff array",
      },
    },
    recording_seats: {
      type: Number,
      min: [1, "Recording Seats must be at least 1"],
      required: true,
    },
    calendarId: {
      type: String,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

studioSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name.en, { lower: true });
  }
  validateTimeRange(this.startTime, this.endTime);
  next();
});

studioSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const startTime = update.startTime || this.get("startTime");
  const endTime = update.endTime || this.get("endTime");
  validateTimeRange(startTime, endTime);
  next();
});

studioSchema.post("save", (doc) => {
  setImage(doc);
});

studioSchema.post("init", (doc) => {
  setImage(doc);
});

function validateTimeRange(start, end) {
  if (start && end) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    if (sh > eh || (sh === eh && sm >= em)) {
      throw new Error("Start time must be before end time.");
    }
  }
}

function setImage(doc) {
  if (doc.thumbnail) {
    doc.thumbnail = `${process.env.BASE_URL}/uploads/studio/${doc.thumbnail}`;
  }

  if (doc.live_view) {
    doc.live_view = `${process.env.BASE_URL}/uploads/studio/${doc.live_view}`;
  }

  if (doc.imagesGallery) {
    doc.imagesGallery = doc.imagesGallery.map(
      (img) => `${process.env.BASE_URL}/uploads/studio/${img}`,
    );
  }
}

studioSchema.virtual("bookingsCount", {
  ref: "Booking",
  localField: "_id",
  foreignField: "studio",
  count: true,
});

module.exports = mongoose.model("Studio", studioSchema);
