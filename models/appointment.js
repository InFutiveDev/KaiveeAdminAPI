const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;
// let AutoIncrement = require('mongoose-sequence')(mongoose);

const appointmentSchema = new Schema(
  {
    userId: {
      type: ObjectId,
    },
    username: {
      type: ObjectId,
      default: null,
    },
    appointmentId: {
      type: Number,
      default: null,
    },
    memberId: {
      type: ObjectId,
      default: null,
    },
    memberPhone: {
      type: ObjectId,
      default: null,
    },
    memberGender: {
      type: ObjectId,
      default: null,
    },
    address: {
      type: ObjectId,
      default: null,
    },
    addressPincode: {
      type: ObjectId,
      default: null,
    },
    nearest_centre: {
      type: ObjectId,
      default: null,
    },
    appointment_date: {
      type: Date,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
    user_mobile: {
      type: Number,
      default: null,
    },
    message_box: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//appointmentSchema.plugin(AutoIncrement, { inc_field: 'appointmentId', id: "appointment_number_Id" });
module.exports = mongoose.model("appointment", appointmentSchema);
