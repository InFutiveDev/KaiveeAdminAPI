const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    first_name:{
        type:String,
        default:null,

    },
    last_name:{
        type:String,
        default:null,
    },
    emailId :{
        type:String,
        default:null,
    },
    mobile:{
        type:Number,
        default:null,
        trim:true,
    },
    message:{
        type:String,
        default:null,
       
    },
    
},
{
    timestamps:true,
}
);

module.exports = mongoose.model("contact",contactSchema);
