
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const landingPageSchema = new Schema({

    name:{
        type:String,
        default:null,
    },
    landing_page_model:{
        type:Number,
        default:null,
    },
    title:{
        type:String,
        default:null,
    },
    leads_source:{
        type:String,
        default:null
    },
    mobile_landing:{
        type:String,
        default:null,
        trim:true,
    },
    // bannerimage:{
    //     type:String,
    //     default:null,
    //     trim:true
    // },
    // landingPageSource:{
    //     type:String,
    //     default:null,
    //     trim:true
    // },
    bannerContant:{
        type:String,
        default:null,

    },
    landingPageArticle:{
        type:String,
        default:null

    },
    testArticle:{
        type:String,
        default:null
    },
    metaTagTitle:{
        type:String,
        default:null,
    },
    metaTagDescription:{
        type:String,
        default:null
    },
    metaTagKeywords:{
        type:String,
        default:null,
        trim:true
    },
    phone:{
        type:String,
        default:null,
        trim:true,
    },
    
    url:{
        type:String,
        default:null,
        trim:true,

    },
    landingpageimage:{
        type:String,
        default:null,
        trim:true,
    },
    landingpageimage_altTag:{
        type:String,
        default:null
    },
    contentimage:{
        type:String,
        default:null,
        trim:true
    },
    contentimage_altTag:{
        type:String,
        default:null
    },
    landingPageStatus:{
        type:String,
        default : null,
        enum :["Active", "Inactive"],
        trim: true,
    },
    addTest:[
      {
        type:ObjectId,
        default:null
      }
    ],
    testDescription:{
        type:String,
        default:null
    },
},
{
    timestamps:true,
}
);
module.exports = mongoose.model("landingPage",landingPageSchema);