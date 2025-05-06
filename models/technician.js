const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const technicianSchema = new Schema({
    technician_name:{
        type:String,
        default:null,
    },
    technician_qualification:{
        type:String,
        default:null,
    },
    technician_image:{
        type:String,
        default:null,
        trim:true,
    },
    technician_description:{
        type:String,
        default:null
    },
},
{
    timestamps:true,
});

module.exports=mongoose.model("technician",technicianSchema);