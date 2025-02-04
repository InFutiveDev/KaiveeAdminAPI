const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    banner_name: {
      type: String,
      default: null,
      trim: true,
    },
    banner_image: {
      type: String,
      default: null,
    },
    banner_status: {
      type: Boolean,
      default: false,
    },
    position:{
      type:Number,
      default:null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", bannerSchema);
