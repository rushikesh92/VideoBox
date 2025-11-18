import { Router } from "express";
import { getLikeCountOnContent, getLikedTweets, getLikedVideos, toggleLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.route('/toggle').post(verifyJWT,toggleLike);
likeRouter.route('/videos').get(verifyJWT, getLikedVideos);
likeRouter.route('/tweets').get(verifyJWT , getLikedTweets);
likeRouter.route('/count/').get(getLikeCountOnContent);


export default likeRouter;