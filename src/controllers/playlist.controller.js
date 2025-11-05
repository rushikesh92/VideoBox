import mongoose from "mongoose";
import { Playlist } from "../models/Playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/Video.model.js";
import { User } from "../models/User.model.js";

const createPlaylist = asyncHandler( async (req,res)=>{
    const {name , description}=req.body;
    if(!name || name.trim() ===''){
        throw new ApiError(400,'name is required');
    }
    const playlist = await Playlist.create(
        {
            name: name.trim(),
            description: description || "",
            owner: req.user?._id,
            videos:[]
        }
    );

    if(!playlist){
        throw new ApiError(500,'Unexpected error while creating playlist');
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201,playlist,'playlist created successfully.')
    );
});

const getPlaylistById = asyncHandler( async(req,res)=>{
    const {playlistId}= req.params;
    if(!playlistId){
        throw new ApiError(400 ,'playlistId param is missing')
    }
    const playlist = await Playlist.findById(playlistId).populate(
        [
            {
                path:"videos",
                select:"title owner thumbnail duration"
            },
            {
                path:"owner",
                select:"username avatar"
            }
    
        ]
    );
    if(!playlist){
        throw new ApiError(404,"playlist not found");
        
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,'playlist fetched successfully')
    );
});

const updatePlaylistInfo = asyncHandler( async (req,res)=>{
    const {playlistId} = req.params;
    const { name , description} = req.body;

    if(!playlistId){
        throw new ApiError(400,'playlistId param is missing');
    }
    if( (!name || name.trim() == '') && (!description || description.trim() == '')){
        throw new ApiError(400,'no fields provided for update');
    }

    const updateInfo ={};
    if (name && name.trim() !== '') updateInfo.name = name.trim();
    if (description && description.trim() !== '') updateInfo.description = description.trim();



    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner:req.user?._id
        },
        {
            $set : updateInfo
        },
        {
            new :true
        }
    ).populate([
        { path: "videos", select: "title owner thumbnail duration" },
        { path: "owner", select: "username avatar" }
    ]
    );;

    if(!updatedPlaylist){
        throw new ApiError(404 ,'playlist not found for current user');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , updatedPlaylist ,'playlist info updated successfully.')
    )

});


const deletePlaylist = asyncHandler( async ( req,res)=>{
    const {playlistId} = req.params;
    if(!playlistId){
        throw new ApiError(400,"playlistId param is missing");
    }
    const result = await Playlist.findOneAndDelete(
        {
            _id:playlistId,
            owner:req.user?._id
        }
    );
    if(!result){
        throw new ApiError(404,'playlist not found for current user')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'playlist deleted successfully.')
    );
});

const addVideosInPlaylist = asyncHandler( async (req,res)=>{
    const { videoIds } = req.body;
    const {playlistId} = req.params;

     if(!playlistId){
        throw new ApiError(400 ,'playlistId param is missing')
    }
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
       throw new ApiError(400, "videoIds must be a non-empty array");
    }

    const existedVideos = await Video.find( 
        {
            _id: { $in : videoIds}
        }
    ).select("_id");

    const validVideoIds = existedVideos.map( v => v._id.toString());

    const invalidVideoIds = videoIds.filter(id => !validVideoIds.includes(id));

    if (validVideoIds.length === 0) {
        throw new ApiError(400, "All provided video IDs are invalid");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id:playlistId,
            owner:req.user?._id
        },
        {
            $addToSet:{
                videos: { $each: validVideoIds }
            }
        },
        { new:true }
    ).populate([
        { path: "videos", select: "title owner thumbnail duration" },
        { path: "owner", select: "username avatar" }
    ]);
    if(!updatedPlaylist){
        throw new ApiError(404, "playlist not found for current user");   
    }

    const message = invalidVideoIds.length
        ? "Some videos were invalid and ignored."
        : "All videos added successfully.";
    
    return res
    .status(200)
    .json(
        new ApiResponse(
                200,
                {
                    playlist:updatedPlaylist,
                    invalidVideoIds,

                },
                message)
    );
});


const removeVideosFromPlaylist = asyncHandler( async (req,res)=>{
    const {playlistId}= req.params;
    const {videoIds} = req.body;
    if(!playlistId){
        throw new ApiError(400 ,'playlistId param is missing')
    }
   if (!Array.isArray(videoIds) || videoIds.length === 0) {
        throw new ApiError(400, "videoIds must be a non-empty array");
    }
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner : req.user?._id
        },
        {
            $pullAll: { videos: videoIds}
        },
        {
            new:true
        }
    ).populate([
        { path: "videos", select: "title owner thumbnail duration" },
        { path: "owner", select: "username avatar" }
    ]
    );
    if(!updatedPlaylist){
        throw new ApiError(404,'playlist not found for current user')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedPlaylist,'videos removed successfully.')
    )
});

const getAllPlaylistsOfUser = asyncHandler( async (req,res)=>{
    const { userId } = req.params;
    if(!userId){
        throw new ApiError(400,'userId param is missing');
    }

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,'user not found')
    }
    const playlists = await Playlist.find({owner:userId});
    let msg = 'playlists fetched successfully'  
    if(playlists.length === 0){
        msg = 'no playlists found for this user'
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlists,msg)
    );

});

export {
    createPlaylist,
    getPlaylistById,
    addVideosInPlaylist,
    updatePlaylistInfo,
    removeVideosFromPlaylist,
    deletePlaylist,
    getAllPlaylistsOfUser
}