import { text } from "express";
import { Tweet } from "../models/Tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {paginate} from 'mongoose-paginate-v2';

const createTweet = asyncHandler( async(req , res)=>{
    const {content} = req.body;
    if(!content || content.trim()==''){
        throw new ApiError(400 ,'content is missing')
    }

    const tweet = await Tweet.create(
        {
            content: content.trim(),
            owner:req.user?._id
        }
    );
    if(!tweet){
        throw new ApiError(500, 'Unexpected error while creating tweet');
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201,tweet,'tweet created successfully')
    );
});

const getTweetById = asyncHandler( async(req,res)=>{
    const {tweetId} = req.params;
    if(!tweetId){
        throw new ApiError(400,'tweetId param is missing');
    }
    const tweet = await Tweet.findById(tweetId)
                             .populate('owner' , 'username avatar');
    if(!tweet){
        throw new ApiError(404, 'Tweet not found');
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , tweet,'Tweet fetched successfully')
    )
});
const updateTweet = asyncHandler( async(req,res)=>{
    const {content} = req.body;
    const {tweetId} = req.params;


    if(!tweetId){
        throw new ApiError(400,'tweetId param is missing');
    }
    if(!content || content.trim() ===''){
        throw new ApiError(400,'content is missing');
    }
    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id:tweetId,
            owner:req.user?._id
        },
        {
            $set:{
                content:content.trim()
            }
        },
        {
            new:true
        }
    );
    if(!updatedTweet){
        throw new ApiError(404,'tweet not found on current users profile')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedTweet,'Tweet updated successfully')
    );
});
const deleteTweet = asyncHandler( async(req,res)=>{
    const {tweetId} = req.params;
    if(!tweetId){
        throw new ApiError(400,'tweetId param is missing');
    }
     const result = await Tweet.findOneAndDelete(
        {
            _id:tweetId,
            owner:req.user?._id
        }
    );
    if(!result){
        throw new ApiError(404,'tweet not found on current users profile')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'tweet deleted successfully')
    );
});
const getAllTweetsOfUser = asyncHandler( async(req,res)=>{
    const {userId} = req.params;
    const {page = 1, limit = 10 } = req.query;
    if(!userId){
        throw new ApiError(400,'userId param is missing');
    }
    const options = {
        page : parseInt(page),
        limit: parseInt(limit),
        sort : { createdAt : -1}
    }
    const result = await Tweet.paginate(
        { 
            owner: userId
        },
        options
    );
    if(!result || !result.docs){
        throw new ApiError(500,'unexpected error fetching tweets');
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , result,'tweets fetched successfully')
    );
});
const getAllTweets= asyncHandler( async(req,res)=>{
    const {page = 1, limit = 10 } = req.query;
    
    const options = {
        page : parseInt(page),
        limit: parseInt(limit),
        sort : { createdAt : -1}
    }
    const result = await Tweet.paginate(
        {},
        options
    );
    if(!result || !result.docs){
        throw new ApiError(500,'unexpected error fetching tweets');
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , result,'tweets fetched successfully')
    );
});


export {
    createTweet,
    getTweetById,
    updateTweet,
    deleteTweet,
    getAllTweetsOfUser,
    getAllTweets

}
