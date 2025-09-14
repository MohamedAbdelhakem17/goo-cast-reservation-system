const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    minHours: {
      type: Number,
      default: 0,
      min: [0, "Min hours must be greater than or equal to 0"],
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },

  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }

  next();
});

module.exports = mongoose.model("Category", categorySchema);
