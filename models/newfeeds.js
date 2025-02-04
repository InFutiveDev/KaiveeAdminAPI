const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    first_name : {
        type:String,
        default:null,
    },
    last_name : {
        type:String,
        default:null,
    },
    mobile_number : {
        type:Number,
        default:null,
    },
    email_id : {
        type:String,
        default:null,
    },
    message : {
        type:String,
        default:null,
    }
},
{
    timestamps:true,
})

module.exports = mongoose.model("feed", feedbackSchema);
