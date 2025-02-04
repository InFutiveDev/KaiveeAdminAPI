const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const familyMemberSchema = new Schema(
  {
    userId: {
      type: ObjectId,
    },
    fullName: {
      type: String,
      default: null,
      trim: true,
    },
    phone: {
      type: Number,
      default: null,
    },
    relation: {
      type: String,
      default: null,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female","Other"],
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("familymember", familyMemberSchema);
