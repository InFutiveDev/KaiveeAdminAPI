const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerSchema = new Schema(
  {
    job_title: {
      type: String,
      default: null,
      trim: true,
    },
    job_posted: {
      type: String,
      default: null,
    },
    Address_1: {
      type: String,
      default: null,
    },
    job_Type_1: {
      type: String,
      default: null,
      
    },
    job_Type_2: {
      type: String,
      default: null,
      
    },
    Address_2: {
      type: String,
      default: null,
    },
    Contact_No: {
      type: String,
      default: null,
      trim: true,
    },
    Experience_Requirement:{
      type: String,
      default: null,
    },
    Job_Description:{
      type: String,
      default: null,
    },
    Job_Status:{
      type:String,
      default:null,
      enum:["Active","InActive"]
    },
    Openings:{
      type:Number,
      default:null
    },
    job_title_url:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("career", careerSchema);
