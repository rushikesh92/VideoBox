import mongoose from "mongoose";
import { Like } from "../models/Like.model.js";
import { Subscription } from "../models/Subscription.model.js";
import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//returns subscribers, total videos, total video likes, total video views
const getChannelStats = asyncHandler(async (req,res)=>{
        const { channelId } = req.params;

        if(!channelId){
            throw new ApiError(400 , "channelId param is missing");
        }
        if(! mongoose.Types.ObjectId.isValid(channelId)){
            throw new ApiError(400,'Invalid channelId');
        }
        const channel = await User.findById(channelId).select("-password -refreshToken");
        if(!channel){
            throw new ApiError(404,'Channel not found');
        }
    
        const subscriberCount = await Subscription.countDocuments(
            {
                channel:channelId,
            }
        );
        const videoCount = await Video.countDocuments({
            owner:channelId
        });

        let isSubscribed = false;
        const subscription = await Subscription.findOne( { channel: channelId , subscriber: req.user?._id})
        if(subscription){
            isSubscribed = true;
        }
        const likeRes = await Like.aggregate(
            [
                {
                    $match:{ onModel: 'Video'}
                }
                ,
                {
                    $lookup : { 
                        from:'videos',
                        localField:'likedOn',
                        foreignField:'_id',
                        as:'video'
                    }
                },
                {
                    $unwind:"$video"
                },
                { 
                    $match: { "video.owner": new mongoose.Types.ObjectId(String(channelId))}
                },
                {
                    $count:"totalLikes"
                }
            ]
        );
        const likeCount = likeRes[0]?.totalLikes || 0;

        const viewRes = await Video.aggregate([
            {
                $match:{ owner: new mongoose.Types.ObjectId(String(channelId))}
            },
            {
                $group: { _id:null , totalViews: { $sum: "$views"}}
            }
        ]);

        const viewCount = viewRes[0]?.totalViews || 0;

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                {
                    channel,
                    subscribers :subscriberCount,
                    totalVideos:videoCount,
                    totalLikes:likeCount,
                    totalViews:viewCount,
                    isSubscribed
                },
                'Channel stats fetched successfully'
            )
        )

});

export {
    getChannelStats
}