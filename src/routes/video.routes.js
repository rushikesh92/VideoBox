import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.meddleware.js";
import {upload} from '../middlewares/multer.middleware.js'
import { deleteVideo, getAllVideos, getAllVideosOfChannel, getVideoById, publishVideo, updateThumbnail, updateVideoDetails } from "../controllers/video.controller.js";

const videoRouter = Router();


videoRouter.route('/publish').post(
    upload.fields(
        [
            {
                name:'video',
                maxCount:1
            },
            {
                name: 'thumbnail',
                maxCount:1
            }

        ]
    ),
    publishVideo
)

videoRouter.route('/').get(getAllVideos);
videoRouter.route('/:videoId').get(optionalAuth, getVideoById);
videoRouter.route('/:videoId').delete(verifyJWT,deleteVideo);
videoRouter.route('/:videoId').patch(verifyJWT,updateVideoDetails);
videoRouter.route('/thumbnail/:videoId').patch(
    verifyJWT,
    upload.single('thumbnail'),
    updateThumbnail);
videoRouter.route('/channel/:channelId').get(getAllVideosOfChannel);

export default videoRouter;