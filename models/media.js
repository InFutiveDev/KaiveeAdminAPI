const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
     media: {
      type: String,
      default: null,
      trim: true,
    },
    link: {
      type: String,
      default: null,
      trim: true,
    },
    text: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("media", mediaSchema);
