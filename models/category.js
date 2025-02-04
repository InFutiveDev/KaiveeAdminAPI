const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      default: null,
      trim: true,
    },
    parent_category_data:{
      type:ObjectId,
      default:null,
    },
    perent_category_name: {
      type: ObjectId,
      default: null,
    },
    category_menu_active: {
      type: Number,
      default: null,
    },
    category_url: {
      type: String,
      default: null,
      trim: true,
      unique: true,
    },
    category_image: {
      type: String,
      default: null,
      trim: true,
    },
    mobile_banner:{
      type:String,
      default:null,
      trim:true
    },
    category_image_altTag:{
      type:String,
      default:null,
    },
    home_image:{
      type:String,
      default:null,
      trim:true,
    },
    home_image_altTag:{
      type:String,
      default:null,
    },
    category_desc: {
      type: String,
      default: null,
      trim: true,
    },
    category_article: {
      type: String,
      default: null,
      trim: true,
    },
    meta_title: {
      type: String,
      default: null,
      trim: true,
    },
    meta_desc: {
      type: String,
      default: null,
      trim: true,
    },
    meta_keyword: {
      type: String,
      default: null,
      trim: true,
    },
    category_status: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("category", categorySchema);
