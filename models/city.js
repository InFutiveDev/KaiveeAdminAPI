const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema({
    
    city_name :{
        type:String,
        default:null,
        trim:true,
    },
    picode :{
        type:Number,
        default:null,
        
    },
    state_name:{
        type:String,
        default:null,
        trim:true,
    },

},
{
    timestamps:true,
});
module.exports = mongoose.model("city",citySchema);