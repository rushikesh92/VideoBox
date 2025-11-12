import mongoose from "mongoose";

const videoViewSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    videoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }

},
{ timestamps:true
}
);

videoViewSchema.index( 
    {
        userId:1 ,
        videoId:1
    } ,
    {
        unique:true
    }
);

export const VideoView = mongoose.model("VideoView" , videoViewSchema);