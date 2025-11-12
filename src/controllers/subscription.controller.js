import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/Subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

const subscribeToChannel = asyncHandler( async(req , res)=>{
    const {channelId} = req.params;
    const userId = req.user?.id;
    if(!channelId){
        throw new ApiError(400 , "channel id is required");
    }
    if(!userId){
        throw new ApiError(401 , "unauthorized request.");
    }
    if (channelId === userId) {
        throw new ApiError(400, "User cannot subscribe to their own channel");
    }
    
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existedSubscription = await Subscription.findOne(
        {
            channel:channelId,
            subscriber:userId
        }
    );

    if(existedSubscription){
        throw new ApiError(409 , "User has already subscribed the channel");
    }
    
    const subscription = await Subscription.create({
        channel:channelId,
        subscriber:userId
    });
    if(!subscription){
        throw new ApiError( 500, "Error occured while subscribing");
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201, subscription , "User subscribed to channel successfully.")
    )


});

const unsubscribeChannel = asyncHandler( async (req , res)=>{
    const {channelId} = req.params;
    const userId = req.user?.id;
    if(!channelId){
        throw new ApiError(400 , "channel id is required");
    }
    if(!userId){
        throw new ApiError(401 , "unauthorized request.");
    }
    if (channelId === userId) {
        throw new ApiError(400, "User cannot unsubscribe to their own channel");
    }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const result = await Subscription.deleteOne({
        channel:channelId,
        subscriber:userId
    });
    if( result.deletedCount == 0){
        throw new ApiError(404 , "Subscription not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Unsubscibed successfully")
    )
});

const getAllSubscriptions = asyncHandler( async (req,res)=>{
    const userId = req.user?.id;
    
    if(!userId){
        throw new ApiError(401 , "Unauthorized request");
    }

    const subscriptions  = await Subscription.aggregate(
        [
            {
                $match:{
                    subscriber: new mongoose.Types.ObjectId(String( userId ))
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField:'channel',
                    foreignField: '_id',
                    as: 'channelInfo',
                    pipeline : [
                        {
                            $project : {
                                fullName: 1,
                                username:1,
                                avatar:1
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200 , subscriptions , "Successfully fetched all subscriptions")
    )

});
const getAllSubscribers = asyncHandler( async (req,res)=>{
    const userId = req.user?.id;
    
    if(!userId){
        throw new ApiError(401 , "Unauthorized request");
    }

    const subscribers  = await Subscription.aggregate(
        [
            {
                $match:{
                    channel: new mongoose.Types.ObjectId(String( userId ))
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField:'subscriber',
                    foreignField: '_id',
                    as: 'subscriberInfo',
                    pipeline : [
                        {
                            $project : {
                                fullName: 1,
                                username:1,
                                avatar:1
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200 , subscribers , "Successfully fetched all subscribers")
    )

});

export { 
    subscribeToChannel,
    unsubscribeChannel,
    getAllSubscriptions,
    getAllSubscribers

}