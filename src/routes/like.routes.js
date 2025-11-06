import { Router } from "express";
import { getLikeCountOnContent, getLikedTweets, getLikedVideos, toggleLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.route('/toggle').post(toggleLike);
likeRouter.route('/videos').get(getLikedVideos);
likeRouter.route('/tweets').get(getLikedTweets);
likeRouter.route('/count/').get(getLikeCountOnContent);


export default likeRouter;