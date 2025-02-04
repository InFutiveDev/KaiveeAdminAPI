const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const franchiseSchema = new Schema({
    your_name:{
        type:String,
        default:null,
    },
    phone_number:{
        type:Number,
        default:null,
        trim:true,

    },
    your_email:{
        type:String,
        default:null,
        trim:true,
    },
    select_location:{
        type:String,
        default:null,
    },
    select_options:{
        type:String,
        default:null,
    },
    your_message:{
        type:String,
        default:null,
    }
},
{
    timestamps:true,
})

module.exports = mongoose.model("franchise", franchiseSchema);