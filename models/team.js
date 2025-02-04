const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    team_name:{
        type:String,
        default:null,
    },
    team_qualification:{
        type:String,
        default:null,
    },
    team_image:{
        type:String,
        default:null,
        trim:true,
    },
    team_description:{
        type:String,
        default:null
    },
},
{
    timestamps:true,
});

module.exports=mongoose.model("team",teamSchema);