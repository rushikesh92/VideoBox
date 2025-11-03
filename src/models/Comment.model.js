import mongoose ,{Schema} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const commentSchema = new Schema(
    {
       content:{
        type :String,
        required:true
       },
       commentator :{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
        },
        video:{
            type: Schema.Types.ObjectId,
            ref:'Video',
            required:true
        }

    },
    {
        timestamps:true
    }
);

commentSchema.plugin(mongoosePaginate)

export const Comment = mongoose.model('Comment' , commentSchema);