import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getAllTweetsOfUser, getTweetById, updateTweet } from "../controllers/tweet.controller.js";

const tweetRouter = Router();

tweetRouter.use(verifyJWT)

tweetRouter.route('/all').get(getAllTweets);
tweetRouter.route('/user/:userId').get(getAllTweetsOfUser);

tweetRouter.route('/').post(createTweet);
tweetRouter.route('/:tweetId').get(getTweetById)
                              .patch(updateTweet)
                              .delete(deleteTweet);

export default tweetRouter;