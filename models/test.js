const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const testSchema = new Schema(
  {
    itdose_code: {
      type: Number,
      default: null,
    },
    itdose_code_status: {
      type: Boolean,
      default: false,
    },
    itdose_test_name: {
      type: String,
      default: null,
      trim: true,
    },
    itdose_test_name_status: {
      type: Boolean,
      default: false,
    },
    itdose_offer_price: {
      type: Number,
      default: null,
    },
    itdose_offer_price_status: {
      type: Boolean,
      default: false,
    },
    itdose_department: {
      type: String,
      default: null,
      trim: true,
    },
    itdose_department_status: {
      type: Boolean,
      default: false,
    },

    package_type: {
      type: String,
      default:"lab-test",
      enum: ["lab-test", "health-package"],
      trim: true,
    },
    package_image:{
      type:String,
      default:null,
      trim:true, 
    },
    package_image_altTag:{
      type:String,
      default:null, 
    },
    specialityName: {
      type: String,
      default: null,
      trim: true,
    },
    cat_id: {
      type: ObjectId,
      default: null,
    },
    code: {
      type: Number,
      default: null,
    },
    test_name: {
      type: String,
      default: null,
      trim: true,
    },
    test_pre_test_info: {
      type: String,
      default: null,
      trim: true,
    },
    report: {
      type: String,
      default: null,
      trim: true,
    },
    test_url: {
      type: String,
      default: null,
      trim: true,
      unique:true,
    },
    mrp: {
      type: Number,
      default: null,
    },
    offer_price: {
      type: Number,
      default: null,
    },
    no_of_parameters: {
      type: Number,
      default: null,
    },
    test_components: {
      type: String,
      default:null,
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
    search_tag: {
      type: String,
      default: null,
      trim: true,
    },
    also_known_as: {
      type: String,
      default: null,
      trim: true,
    },
    test_type: {
      type: String,
      default: null,
      trim: true,
    },
    department: {
      type: String,
      default: null,
      trim: true,
    },
    preparation: {
      type: String,
      default: null,
      trim: true,
    },
    reporting: {
      type: String,
      default: null,
      trim: true,
    },
    test_price_info: {
      type: String,
      default: null,
      trim: true,
    },
    related_tests: {
      type: String,
      default: null,
      trim: true,
    },
    by_habits: [{
      _id: { type: Schema.Types.ObjectId, ref: 'Habit' },
      hebitName: { type: String }
    }
  ],
    by_healthRisk: [{
      _id: { type: Schema.Types.ObjectId, ref: 'HealthRisk' },
      healthRiskTitle: { type: String }
    },
  ],
    test_status: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: null,
      trim: true,
    },
    collection_type:{
      type:String,
      default:"centre-visit",
      enum:["home collection","centre-visit"],
    },
    number_of_star:{
      type:Number,
      enum:[1,2,3,4,5]
    },
    number_of_review:{
      type:Number,
      default:null
    },
    featured_test:{
      type:Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("test", testSchema);
