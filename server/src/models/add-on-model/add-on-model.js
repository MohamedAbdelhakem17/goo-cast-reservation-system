const mongoose = require("mongoose");

const AddOnSchema = new mongoose.Schema({
  name: {
    ar: {
      type: String,
      required: [true, "Please provide the Arabic name"],
      trim: true,
    },
    en: {
      type: String,
      required: [true, "Please provide the English name"],
      trim: true,
    },
  },

  description: {
    ar: {
      type: String,
      required: [true, "Please provide the Arabic description"],
      trim: true,
    },
    en: {
      type: String,
      required: [true, "Please provide the English description"],
      trim: true,
    },
  },

  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price must be a positive number"],
  },

  image: {
    type: String,
    required: [true, "Please provide an image"],
    trim: true,
  },

  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },

  // Recommendation metadata
  category: {
    type: String,
    enum: ["equipment", "editing", "production", "accessibility", "other"],
    default: "other",
  },

  tags: {
    type: [String],
    default: [],
  },

  // Recommendation rules
  recommendation_rules: {
    min_persons: {
      type: Number,
      default: null,
    },
    max_persons: {
      type: Number,
      default: null,
    },
    recommended_for_packages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "HourlyPackage" }],
      default: [],
    },
    excluded_from_packages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "HourlyPackage" }],
      default: [],
    },
    is_universal_recommendation: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
});

function setImage(doc) {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/addons/${doc.image}`;
  }
}

AddOnSchema.post("save", (doc) => {
  setImage(doc);
});

AddOnSchema.post("init", (doc) => {
  setImage(doc);
});

module.exports = mongoose.model("AddOn", AddOnSchema);
