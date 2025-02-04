const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reasearchSchema = new Schema({
    reasearchname :{
        type:String,
        default:null,

    },
    reasearchfile:{
        type:String,
        default:null,
        trim:true,
    },
},
{
    timestamps:true,

});

module.exports = mongoose.model("reasearch",reasearchSchema);