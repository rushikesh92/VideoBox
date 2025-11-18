import { Like } from "../models/Like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Video } from "../models/Video.model.js";
import { Tweet } from "../models/Tweet.model.js";
import { Comment } from "../models/Comment.model.js";

const toggleLike = asyncHandler(async (req, res) => {
    const { contentId, model } = req.body;
    const userId = req.user?._id;
    if (!contentId || !model) {
        throw new ApiError(400, 'Both contentId and model is required');
    }
    if (!(['Video', 'Comment', 'Tweet'].includes(model.trim()))) {
        throw new ApiError(400, 'provided model is not valid');
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(400, 'provided contentId is not valid');
    }
    const like = await Like.findOne({
        likedBy: userId,
        likedOn: contentId,
        onModel: model
    });

    if (!like) {
        const newLike = await Like.create(
            {
                likedBy: userId,
                likedOn: contentId,
                onModel: model
            }
        );

        if (!newLike) {
            throw new ApiError(500, "error while adding like");

        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, newLike, 'liked content successfully.')
            );
    }

    const result = await like.deleteOne()
    if (!result) {
        throw new ApiError(500, "error while removing like");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'unliked content successfully.')
        );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const videos = await Like.aggregate(
        [
            {
                $match: {
                    likedBy: userId,
                    onModel: 'Video'
                }
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'likedOn',
                    foreignField: '_id',
                    as: 'video',
                    pipeline: [
                        {
                            $project: {
                                videoFile: 1,
                                thumbnail: 1,
                                owner: 1,
                                title: 1,
                                duration: 1,
                                views: 1

                            }
                        }
                    ]

                }
            }
        ]
    );
    console.log(videos);
    if (!videos) {
        throw new ApiError(500, 'unexpected error loading liked videos');
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, 'fetched liked videos successfully')
        );

});
const getLikedTweets = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const tweets = await Like.aggregate(
        [
            {
                $match: {
                    likedBy: userId,
                    onModel: 'Tweet'
                }
            },
            {
                $lookup: {
                    from: 'tweets',
                    localField: 'likedOn',
                    foreignField: '_id',
                    as: 'tweet'

                }
            }
        ]
    );
    console.log(tweets);
    if (!tweets) {
        throw new ApiError(500, 'unexpected error loading liked tweets');
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, tweets, 'fetched liked tweets successfully')
        );

});

const getLikeCountOnContent = asyncHandler(async (req, res) => {
    const { contentId, model } = req.body;
    if (!contentId || !model) {
        throw new ApiError(400, 'Both contentId and model is required');
    }
    if (!(['Video', 'Comment', 'Tweet'].includes(model.trim()))) {
        throw new ApiError(400, 'provided model is not valid');
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        throw new ApiError(400, 'provided contentId is not valid');
    }
    
    let content;
    if (model.trim() === 'Video') {
        content = await Video.findById(contentId);
    }
    else if (model.trim() === 'Tweet') {
        content = await Tweet.findById(contentId);
    }
    else {
        content = await Comment.findById(contentId);
    }

    if(!content){
        throw new ApiError(404,'Content not found');
    }
    
    const likeCount = await Like.countDocuments(
        {
            likedOn:contentId,
            onModel:model.trim()
        }
    );
    
    return res
    .status(200)
    .json(
        new ApiResponse(200 ,{contentId, likeCount} ,'likeCount fetched successfully.')
    )


});

export {
    toggleLike,
    getLikedVideos,
    getLikedTweets,
    getLikeCountOnContent
}