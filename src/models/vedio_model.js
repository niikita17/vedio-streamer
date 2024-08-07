import mongoose from "mongoose";
import { Schema } from "mongoose";
import monggoseAggregatePaginate from "monggose-aggregrate-paginate-v2"

const vedioSchema=new Schema({
    vedioFile:{
        type:String
    },
    thumbnil:{
        type:String
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }                     
},{
    timestamps:true
})
vedioSchema.plugin(monggoseAggregatePaginate)
export const vedio= mongoose.model("vedio",vedioSchema);
