import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async(req ,res)=>{

    const health = {
        uptime : process.uptime(),
        message :'Videobox Backend is running',
        documentation: "https://github.com/rushikesh92/videobox/docs/#api",
        timestamp: Date.now()
    };

    try {
        await mongoose.connection.db.admin().ping();
        health.db = 'connected';
        return res.status(200).json(health);

    } catch (error) {
        health.db ='disconnected';
        health.message =error.message;
        return res.status(503).json(health);
    }

})

export {healthcheck}