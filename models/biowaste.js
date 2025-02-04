const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wasteSchema = new Schema({
    months:{
        type:String,
        default:null
    },
    year:{
        type:String,
        default:null
    },
    centre_name:{
        type:String,
        default:null,
       
    },
    red_bag:{
        type:String,
        default:null,
    },
    yellow_bag:{
        type:String,
        default:null,
    },
    sharp_box:{
        type:String,
        default:null,
    },
    blue_card_board_box:{
        type:String,
        default:null,
    }
},{
    timestamps:true,
});

module.exports = mongoose.model("biowaste",wasteSchema);
