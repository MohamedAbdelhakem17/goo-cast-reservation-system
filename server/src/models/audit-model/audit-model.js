const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      enum: ["create", "delete", "update"],
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    targetId: {
      type: String,
    },

    changes: [
      {
        key: String,
        old: mongoose.Schema.Types.Mixed,
        new: mongoose.Schema.Types.Mixed,
      },
    ],

    ip: {
      type: String,
    },
  },
  { timestamps: true }
);

auditSchema.pre(/^find/, function (next) {
  this.populate({
    path: "actor",
    select: "name role _id",
  });
  next();
});

module.exports = mongoose.model("Audit", auditSchema);
