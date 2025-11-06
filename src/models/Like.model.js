import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema(
    {
        likedBy: {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        likedOn:{
            type:Schema.Types.ObjectId,
            refPath: "onModel",//dynamic reference
            required :true
        },
        onModel:{
            type:String,
            required:true,
            enum:['Video','Comment','Tweet']
        }
    },
    { timestamps: true}
)

likeSchema.index(//for uniqueness
    {
        likedBy:1,
        likedOn:1,
        onModel:1
    },
    { unique:true}
)
likeSchema.index(
    { 
        likedOn: 1, 
        onModel: 1 
    }
);
export const Like = mongoose.model('Like',likeSchema);