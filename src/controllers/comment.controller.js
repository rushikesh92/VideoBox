import { populate } from "dotenv";
import { Comment } from "../models/Comment.model.js";
import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "mongoose-paginate-v2";

const getAllCommentsOnAVideo = asyncHandler( async(req,res)=>{
    const {videoId} = req.params;
    const {page=1 ,limit=10} = req.query;

    if(!videoId){
        throw new ApiError(400 , 'videoId param is missing');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404,'video not found');
    }
    const options = {
        page : parseInt(page),
        limit: parseInt(limit),
        sort: {createdAt:-1}
    }
    const result = await Comment.paginate(
        {
            video:videoId
        },
        {
            ...options,
            populate:{
                path:'commentator',
                select:'username avatar'
            }
        }
    );

    if (!result || !result.docs) {
        throw new ApiError(500, "Unexpected error while fetching comments");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,result,"comments on video fetched successfully")
    );
})

const addCommentOnVideo = asyncHandler( async (req , res)=>{
    const {videoId} = req.params;
    const {comment } = req.body; 
    if(!videoId){
        throw new ApiError(400 , 'videoId param is missing');
    }
    if(!comment || comment.trim() ===''){
        throw new ApiError(400,'comment is missing');
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404 ,'video not found');
    }

    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, 'unauthorized request');
    }

    const commented = await Comment.create(
        {
            content:comment,
            commentator: userId,
            video:video._id
        }
    );
    if(!commented){
        throw new ApiError(500 ,'Error while adding comment');
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201,commented , 'Comment added successfully')
    );

});

const updateComment = asyncHandler( async ( req, res)=>{
    const {commentId} = req.params;
    const {comment} = req.body;

    if(!comment || comment.trim() ===''){
        throw new ApiError(400,'comment is missing');
    }
    if(!commentId){
        throw new ApiError(400 ,'commentId param is missing');
    }
    const existedComment = await Comment.findById(commentId);
    if(!existedComment){
        throw new ApiError(404 ,'comment not found');
    }
    if(!existedComment.commentator.equals(req.user?._id)){
        throw new ApiError(401,'Only original commentator can update comment');
    }
    const result = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content : comment
            }
        },
        {
            new:true
        }
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,result , 'comment updated successfully')
    );


});

const deleteComment = asyncHandler( async(req,res)=>{
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400 ,'commentId param is missing');
    }

    const result = await Comment.findOneAndDelete(
        {
            _id:commentId,
            commentator:req.user?._id
        }
    );
    if(!result){
        throw new ApiError(400 , 'Cannot delete comment : either its not found or user is not original commentator')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} , 'comment delete successfully')
    );
})

export {
    addCommentOnVideo,
    updateComment,
    deleteComment,
    getAllCommentsOnAVideo

}