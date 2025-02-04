const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const menuSchema = new Schema(
  {
    MenuTitle: {
      type: String,
      default: null,
      trim: true,
    },
    MenuPostion: {
      type: Number,
      default: 0,
    },
    MenuURL: {
      type: String,
      default: null,
      trim: true,
    },
    MenuStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("menu", menuSchema);
