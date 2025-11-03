import mongoose,{Schema} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const tweetSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        content: {
            type: String,
            required:true
        }
    },
    {
        timestamps:true
    }
);

tweetSchema.plugin(mongoosePaginate);

export const Tweet = mongoose.model('Tweet' ,tweetSchema);