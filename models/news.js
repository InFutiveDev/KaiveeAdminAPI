const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    news_name:{
        type:String,
        default:null,

    },
    news_category:{
        type:String,
        default:null,
    },
    news_date :{
        type:String,
        default:null,
    },
    news_thumbnail:{
        type:String,
        default:null,
        trim:true,
    },
    news_status:{
        type:String,
        default:null,
        trim:true
    },
    link1:{
        type:String,
        default:null,
        trim:true,
    },
    link1_name:{
        type:String,
        default:null,
    },
    link2:{
        type:String,
        default:null,
        trim:true,
    },
    link2_name:{
        type:String,
        default:null,
        
    },
    link3:{
        type:String,
        default:null,
        trim:true,
    },
    link3_name:{
        type:String,
        default:null,
        
    },
    link4:{
        type:String,
        default:null,
        trim:true,
    },
    link4_name:{
        type:String,
        default:null,
        
    },
    link5:{
        type:String,
        default:null,
        trim:true,
    },
    link5_name:{
        type:String,
        default:null,
        
    },
    news_description:{
        type:String,
        default:null
    },
},
{
    timestamps:true,
}
);

module.exports = mongoose.model("news",newsSchema);
