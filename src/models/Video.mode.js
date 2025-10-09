import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        videoFile :{
            type:String,
            required :true,          
        },
        thumbnail :{
            type:String,
            required :true,
        },
        owner :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required :true,
        },
        title :{
            type:String,
            required :true,
        },
        descrition :{
            type:String,
            required:true
        },
        duration :{
            type:Number,
            required:true
        },
        views :{
            type:Number,
            default:0
        },
        isPublished :{
            type:Boolean,
            default:true
        },

    },
    {
        timestamps:true
    }
);

export const Video = mongoose.model('Video',videoSchema);