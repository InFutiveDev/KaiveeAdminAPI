const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const inquirySchema = new Schema(
  {
    
    patient_name: {
      type: String,
      default: null,
      trim: true,
    },
    patient_email: {
      type: String,
      default: null,
      trim: true,
    },
    
    
    message: {
      type: String,
      default: null,
      trim: true,
    },
    
    mobile_number: {
      type: Number,
      default: null,
      trim:true,
    },
    appointment_date: {
      type: String,
      default: null,     
    },
    otp:{
      type:Number,
      default:null,
      trim:true,
    },
    inquiry_from:{
      type:String,
      default:null,
    },
    url:{
      type:String,
      default:null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("inquiry", inquirySchema);
