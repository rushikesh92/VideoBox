import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';

export const verifyJWT =asyncHandler( async (req , _ , next)=>{
    
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");// Bearer IJjfdikIUGdbk...
    
    // console.log("access", accessToken);
    if(!accessToken ){
        throw new ApiError(401 , "Unauthorized request");
    }
   try {
    
        const decodedToken =  jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401 , "Invalid access token")
        }
    
        req.user = user;
        next();

   } catch (error) {
        throw new ApiError(401, error?.message || "Error while verifying access token")
   }
})