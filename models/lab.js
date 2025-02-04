const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labSchema = new Schema(
  { 
    branch_Name: {
    type: String,
    default: null,
    trim: true,
  },
  branch_address: {
    type: String,
    default: null,
    trim: true,
  },
  branch_location: {
    type: String,
    default: null,
    trim: true,
  },
  service_avilable:{
    type:String,
    default:null,
  },
  contact_number:{
    type:String,
    default:null,
    trim:true,
  },
  timing:{
    type:String,
    default:null,
  },
  email:{
    type:String,
    default:null
  },
  map_url:{
    type:String,
    default:null
  },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lab", labSchema);
