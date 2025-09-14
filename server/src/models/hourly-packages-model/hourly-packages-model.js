const mongoose = require("mongoose");

const HourlyPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },

    target_audience: {
      type: [String],
      required: [true, "Please provide details"],
      set: (arr) => arr.map((s) => s.trim()),
    },

    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    details: {
      type: [String],
      required: [true, "Please provide details"],
      set: (arr) => arr.map((s) => s.trim()),
    },

    post_session_benefits: {
      type: [String],
      required: [true, "Please provide details"],
      set: (arr) => arr.map((s) => s.trim()),
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
      type: String,
    },

    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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

module.exports = mongoose.model("HourlyPackage", HourlyPackageSchema);

// Old Price Code
{
  // prices: {
  // twoHours: {
  // type: Number,
  // required: [true, "Please provide a price"],
  // min: [0, "Price must be a positive number"],
  // },
  // halfDay: {
  // type: Number,
  // required: [true, "Please provide a price"],
  // min: [0, "Price must be a positive number"],
  // },
  // fullDay: {
  // type: Number,
  // required: [true, "Please provide a price"],
  // min: [0, "Price must be a positive number"],
  // },
  // },
  // savings: {
  // halfDay: {
  // type: Number,
  // required: [true, "Please provide a saving"],
  // min: [0, "Saving must be a positive number"],
  // },
  // fullDay: {
  // type: Number,
  // required: [true, "Please provide a saving"],
  // min: [0, "Saving must be a positive number"],
  // },
  // },
}
