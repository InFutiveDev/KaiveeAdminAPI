const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const corporateSchema = new Schema({

    your_name:{
        type:String,
        default:null,
    },
    company_name:{
        type:String,
        default:null,
    },
    your_email:{
        type:String,
        default:null,
    },
    mobile_number:{
        type:Number,
        default:null,
    },
    select_enquiry:{
        type:String,
        default:null,
    },
    },
    {
        timestamps:true,
    },
);

module.exports = mongoose.model("corporate_form",corporateSchema )