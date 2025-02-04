const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hebitSchema = new Schema(
  {
    hebitName: {
      type: String,
      default: null,
      trim: true,
    },
    hebit_image: {
      type: String,
      default: null,
      trim: true,
    },
    hebit_image_alt: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("hebit", hebitSchema);
