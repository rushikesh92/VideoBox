import { Video } from "../models/Video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinaryFileManage.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { paginate } from "mongoose-paginate-v2";

const publishVideo = asyncHandler(async (req, res) => {


    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, 'title and description is missing')
    }

    let videoLocalPath;
    let thumbnailLocalPath;

    if (req.files) {
        if (Array.isArray(req.files.video) && req.files.video.length > 0) {
            videoLocalPath = req.files.video[0].path;
        }
        if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
            thumbnailLocalPath = req.files.thumbnail[0].path;
        }
    }
    if (!videoLocalPath) {
        throw new ApiError(400, 'Video file is missing')
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail file is missing");
    }

    const videoRes = await uploadOnCloudinary(videoLocalPath);
    if (!videoRes) {
        throw new ApiError(500, "Error while uploading video file on cloudinary");
    }
    const thumbnailRes = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailRes) {
        throw new ApiError(500, "Error while uploading thumbnail file on cloudinary");
    }

    // console.log(videoRes)
    const video = await Video.create({
        title: title,
        descrition: description,
        owner: req.user?._id,
        videoFile: videoRes.url,
        thumbnail: thumbnailRes.url,
        duration: videoRes.duration,

    })
    if (!video) {
        await deleteFromCloudinary(videoRes.url);
        await deleteFromCloudinary(thumbnailRes.url);
        throw new ApiError(500, "Error while publishing video");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, video, 'Video published successfully.')
        );

});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, 'videoId parameter is missing');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }

    if (!(video.owner.equals(req.user?._id))) {
        throw new ApiError(401, 'Only video publisher can delete the video')
    }
    const deleteResult = await Video.findByIdAndDelete(video._id);
    // console.log(deleteResult);
    if (!deleteResult) {
        throw new ApiError(500, 'Error deleting video')
    }
    await deleteFromCloudinary(video.videoFile);
    await deleteFromCloudinary(video.thumbnail);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "video deleted successfully")
        );

});

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const {title,description} = req.body;
    //incomplete

})

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, 'Video id param is missing');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, 'Video fetched successfully')
        );
});65


const getAllVideos = asyncHandler( async(req,res)=>{
    const {page=1 , limit=10} = req.query;

    const options = {
        page:parseInt(page),
        limit:parseInt(limit),
        sort: {createdAt : -1}//newest first
    };

    const result = await Video.paginate({} ,options);

    if (!result || !result.docs) {
        throw new ApiError(500, "Unexpected error while fetching videos");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,result,"Videos fetched successfully")
    );

})

const getAllVideosOfChannel = asyncHandler( async(req,res)=>{
    const {page=1 , limit=10} = req.query;
    const {channelId } =req.params;
    if(!channelId){
        throw new ApiError(400 ,'channelId param is missing ')
    }
    const options = {
        page:parseInt(page),
        limit:parseInt(limit),
        sort: {createdAt : -1}//newest first
    };

    const result = await Video.paginate(
            {
                owner:channelId
            },
            options
        );

    if (!result || !result.docs) {
        throw new ApiError(500, "Unexpected error while fetching videos");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,result,"Videos fetched successfully")
    );

})
export {
    publishVideo,
    deleteVideo,
    getVideoById,
    getAllVideos,
    getAllVideosOfChannel,
    updateVideoDetails
}