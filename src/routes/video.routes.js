import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from '../middlewares/multer.middleware.js'
import { deleteVideo, getAllVideos, getAllVideosOfChannel, getVideoById, publishVideo, updateThumbnail, updateVideoDetails } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.use(verifyJWT);

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
videoRouter.route('/:videoId').get(getVideoById);
videoRouter.route('/:videoId').delete(deleteVideo);
videoRouter.route('/:videoId').patch(updateVideoDetails);
videoRouter.route('/thumbnail/:videoId').patch(
    upload.single('thumbnail'),
    updateThumbnail);
videoRouter.route('/channel/:channelId').get(getAllVideosOfChannel);

export default videoRouter;