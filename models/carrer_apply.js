const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerFormSchema = new Schema(
  {
    First_name: {
      type: String,
      default: null,
      trim: true,
    },
    Last_name: {
      type: String,
      default: null,
    },
    Email: {
      type: String,
      default: null,
      trim:true
    },
    Mobile: {
      type: Number,
      default: null,
      trim:true 
    },
    State: {
      type: String,
      default: null,
    },
    City: {
      type: String,
      default: null,
    },
    Experince: {
      type: String,
      default: null,
    },
    Current_company:{
      type: String,
      default: null,
    },
    Current_salary:{
      type: String,
      default: null,
    },
    Expected_salary:{
      type:String,
      default:null,
    },
    linkedIn:{
      type:String,
      default:null
    },
    Cv_document:{
        type:String,
        default:null,
        trim:true
    },
    job_applied:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("career_Form", careerFormSchema);
