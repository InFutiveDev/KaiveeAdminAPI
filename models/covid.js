

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const covidSchema = new Schema({
    
    patientName:{
        type:String,
        default:null,
        trim : true,
    },
    testType:{
        type:String,
        default: null,
        enum: ["covid-19 drive", "covid-19 booth"],
        trim: true,
    },
    transactionId:{
        type:Number,
        default:null,
    },
    age:{
        type:Number,
        default:null,
    },
    dateOfBirth:{
        type:String,
        default:null,
        trim:true,
    },
    gender:{
        type:String,
        default:null,
        trim : true,
    },
    
    address:{
        type:String,
        default: null,
    },
    city:{
        type:String,
        default: null,
        trim : true
    },
    state:{
        type: String,
        default: null,
        trim: true
    },
    postal_code:{
        type:Number,
        default:null,
    },
    nationality:{
        type:String,
        default:null,
        trim: true
    },

    phone:{
        type:Number,
        default:null,
    },
    whatsapp:{
        type:Number,
        default:null,
               
    },
    email:{
        type:String,
        default:null,
        trim:true,
    },
    drive_location :{
        type:String,
        default:null,
        
    },
    vehicle_no:{
        type:String,
        default:null,
        trim:true,
    },
    vehicle_model_colour:{
        type:String,
        default:null
    },
    
    dateOfSample:{
        type:Date,
        default:null
    },
    prefferedTime:{
        type:String,
        default:null,
    },

    documents:{
        type:String,
        default:null,
        trim: true,
    },
    paidStatus:{
        type:Boolean,
        default:false,

    },

},
{ 
    timestamps:true,

}
);

module.exports = mongoose.model("covid-19",covidSchema);