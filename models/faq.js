const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const faqSchema = new Schema(
  {
    faq_title:{
        type:String,
        default:null,
    },
    faq_description:{
        type:String,
        default:null,
    },
    test_id:{
        type:ObjectId,
        default:null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("faq", faqSchema);
