const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthRiskSchema = new Schema(
  {
    healthRiskTitle: {
      type: String,
      default: null,
      trim: true,
    },
    healthRisk_image: {
      type: String,
      default: null,
      trim: true,
    },
    healthRisk_image_alt: {
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

module.exports = mongoose.model("healthRisk", healthRiskSchema);
