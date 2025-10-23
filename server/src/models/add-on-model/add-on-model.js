// models/AddOn.js
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
