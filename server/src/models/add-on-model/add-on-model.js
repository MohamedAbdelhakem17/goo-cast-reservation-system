// models/AddOn.js
const mongoose = require("mongoose");

const AddOnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
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

  // icon: String,
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
