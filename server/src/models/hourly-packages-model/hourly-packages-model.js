const mongoose = require("mongoose");
const slugify = require("slugify");

const HourlyPackageSchema = new mongoose.Schema(
  {
    name: {
      ar: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
      },
      en: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
      },
    },

    target_audience: {
      ar: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
      en: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
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

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    details: {
      ar: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
      en: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
    },

    not_included: {
      ar: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
      en: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
    },

    post_session_benefits: {
      ar: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
      en: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
    },

    not_included_post_session_benefits: {
      ar: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
      en: {
        type: [String],
        required: [true, "Please provide details"],
        set: (arr) => arr.map((s) => s.trim()),
      },
    },

    icon: String,

    price: {
      type: Number,
      // required: [true, "Please provide a price"],
      min: [0, "Price must be a positive number"],
    },

    isFixed: {
      type: Boolean,
      default: false,
    },

    perHourDiscounts: {
      type: Map,
      of: Number,
      default: {},
    },

    image: {
      type: String,
      trim: true,
    },

    session_type: {
      en: { type: String },
      ar: { type: String },
    },

    package_type: {
      type: String,
      enum: ["basic", "bundle"],
      default: "basic",
    },

    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },

    show_image: {
      type: Boolean,
      required: true,
      default: false,
    },

    best_for: {
      type: Number,
      required: true,
      default: 1,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: function () {
        return slugify(this.name.en, { lower: true });
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

HourlyPackageSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "category",
      select: "name slug",
    },
  ]);
  next();
});

function setImage(doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/services/${doc.image}`;
  }
}

HourlyPackageSchema.post("save", (doc) => {
  setImage(doc);
});

HourlyPackageSchema.post("init", (doc) => {
  setImage(doc);
});

HourlyPackageSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name.en, { lower: true });
  }

  next();
});
module.exports = mongoose.model("HourlyPackage", HourlyPackageSchema);
