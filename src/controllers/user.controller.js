import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinaryFileManage.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';



const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
      const user = await User.findById(userId);
      if (!user) throw new ApiError(404, "User not found");

      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();

      user.refreshToken = refreshToken;
      await user.save( { validateBeforeSave:false });

      return { accessToken , refreshToken }

    } catch (error) {
      throw new ApiError(500 , "Something went wrong while generating refesh and access tokens")
    }

}


// steps to register
/**
 * get user details from frontend
 * validate email
 * check if user already exists(uniqueness of email and username)
 * check if avatar and banner provided
 * upload them to cloudinary
 * create User object => create entry in DB
 * check status of User creation
 * remove password and refresh token from response 
 * return res
 */
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // console.log(fullName," ",email," ",username);
  //   res.status(200  ).json({
  //     message: "ok",

  // })

  if (
    [fullName, email, username, password].some((field) => (!field))//if any of feild is empty return true
  ) {
    throw new ApiError(400, "All fields are required")
  }
  const existedUser = await User.findOne({//gets  user with given email or username
    $or: [{ email }, { username }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  // console.log(req.files);
  let avatarLocalPath;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
  }
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");

  }

  const avatarRes = await uploadOnCloudinary(avatarLocalPath);
  let coverImageRes = null;
  if (coverImageLocalPath) {
    coverImageRes = await uploadOnCloudinary(coverImageLocalPath);
  }
  if (!avatarRes) {
    throw new ApiError(400, "Avatar file is required");

  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatarRes.url,
    coverImage: coverImageRes?.url || ""
  })

  //check if user is actually created or not
  const createdUser = await User.findById(user._id).select(//by default all feilds are selected 
    "-password -refreshToken" //this removes specified fields
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }


  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully.")
  );


});

//steps to login
/**
 * get user details from frontend
 * check if they are not empty 
 * validate password 
 * generate refresh token and access token
 * send token in cookie
 * return res
 */

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if( !(username || email)){
      throw new ApiError(400 ,"Email or username is required.");
  }

  const existedUser = await User.findOne({ 
    $or :[ { username } , { email }]
   });
  // console.log(existedUser, "  eu");
  
  if (!existedUser) {
    throw new ApiError(404, "User does not exist");
  }
  
  const isPasswordValid =await existedUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.")
  }

  const {accessToken , refreshToken }= await generateAccessTokenAndRefreshToken(existedUser._id);

  const loggedInUser =await User.findById(existedUser._id).select("-password -refreshToken");
  
  const cookieOptions ={//to make cookie only modifiable by server not frontend
      httpOnly:true,
      secure :true
  }

  return res
  .status(200)
  .cookie("accessToken" , accessToken , cookieOptions)
  .cookie("refreshToken" , refreshToken, cookieOptions)
  .json(
      new ApiResponse(
        200, 
        {
            user: loggedInUser, accessToken, refreshToken
        },
         "User logged in successfu1lly.")
  );

});

//delete cookies 
//remove refreshToken from DB

const logoutUser = asyncHandler( async (req, res) =>{

  const user =await  User.findByIdAndUpdate(
    req.user._id,
     {
      $set : {
        refreshToken:undefined
      }
    },
    {
      new: true
    }
  );


   const cookieOptions ={
      httpOnly:true,
      secure :true
  }

  return  res
  .status(200)
  .clearCookie("accessToken",cookieOptions)
  .clearCookie("refreshToken",cookieOptions)
  .json(
    new ApiResponse(
      200,
      {},
      "User logged out succesfully."
    )
  )
});

const refreshAccessTokens = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authourization")?.replace("Bearer ", "");
  if(!incomingRefreshToken){
    throw new ApiError(401 ,"Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken._id);
    if(!user){
      throw new ApiError(401,"Invalid refresh token")
    }
    if(incomingRefreshToken != user.refreshToken){
      throw new ApiError(401,"Refresh token is expired or used");

    }
    const {accessToken,refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const cookieOptions={
      httpOnly :true,
      secure : true
    }

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .cookie("accessToken",accessToken,cookieOptions)
    .json(
      new ApiResponse(200 , {accessToken,refreshToken} , "Access token refreshed ")
    )

  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async (req,res) =>{
    const {oldPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user?._id);

    if( !( await user.isPasswordCorrect(oldPassword))){
      throw new ApiError(400 ,"Incorrect old password");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave:false})
    
    return res
    .status(200)
    .json(
      new ApiResponse(200 , {},"Password changed successfully")
    );


});

const getCurrentUser = asyncHandler(async (req,res) =>{

    return res
    .status(200)
    .json(
      new ApiResponse(200,req.user ,"current user fetched successfully.")
    )
});

const updateAccountDetails = asyncHandler( async (req,res)=>{
      const {newEmail, newFullName } = req.body;

      if(!(newEmail && newFullName)){
        throw new ApiError(400 ,"Both email and fullName is required")
      }
  
      const user  = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
            email : newEmail,
            fullName:newFullName
          }
        },
        {
          new:true//return updated user
        }
      ).select("-password -refreshToken");

      return res
      .status(200)
      .json(
        new ApiResponse(200 , user,"User account details updated successfully.")
      )
});

const updateUserAvatar = asyncHandler( async (req,res)=>{
      const avatarLocalPath = req.file?.path;
      if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing");
      }
      
      const oldUser = await User.findById(req.user?._id).select("avatar")
      const oldAvatarUrl = oldUser.avatar;
      
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if(!avatar){
        throw new ApiError(500 , "Error while uploading avatar on cloudinary");    
      }

      const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          avatar: avatar.url
        }
      },
      {
        new:true
      }
    ).select("-password -refreshToken");
    
    await deleteFromCloudinary(oldAvatarUrl);
    
    return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar image updated successfully")
    );
})
const updateUserCoverImage = asyncHandler( async (req,res)=>{
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
      throw new ApiError(400 , "Cover image file is missing");
    }
    
    const oldUser = await User.findById(req.user?._id).select("coverImage")
    const oldCoverImageUrl = oldUser.coverImage;
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!coverImage){
      throw new ApiError(500 , "Error while uploading coverImage on cloudinary");    
    }
    
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          coverImage: coverImage.url
        }
      },
      {
        new:true
      }
    ).select("-password -refreshToken");
    
    if(oldCoverImageUrl){
        await deleteFromCloudinary(oldCoverImageUrl);
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    );
})

export { 
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessTokens , 
    changeCurrentPassword ,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}