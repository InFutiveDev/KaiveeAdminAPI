const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const subsSchema = new Schema(
    { 
        subsriber_email:{
        type:String,
        default:null,
        trim:true,
        }
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("subscribe",subsSchema);