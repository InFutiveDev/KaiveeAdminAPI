const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const awardSchema = new Schema({
    awardTitle:{
        type:String,
        default:null,
    },
    awardDescription:{
        type:String,
        default:null,
    },
    awardfile:{
        type:String,
        default:null,
        trim:true,
    },
},
{
    timestamps:true,
});

module.exports=mongoose.model("award",awardSchema);