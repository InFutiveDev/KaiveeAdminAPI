
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    patient_name:{
        type:String,
        default:null,
        
    },
    dob:{
        type:String,
        default:null,

    },
    age:{
        type:Number,
        default:null,
        trim:true,
    },
    gender:{
        type:String,
        default:null,
    },
    add_prescription:{
        type:String,
        default:null,
        trim:true,
    },
    user_mobile:{
        type:Number,
        default:null,
        trim:true,
    },
    caseId:{
        type:Number,
        default:null,
        trim:true,
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("prescription",prescriptionSchema);

