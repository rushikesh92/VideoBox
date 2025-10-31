import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllSubscribers, getAllSubscriptions, subscribeToChannel, unsubscribeChannel } from "../controllers/subscription.controller.js";

const subcriptionRouter = Router();

subcriptionRouter.route('/subscribe/:channelId').post(verifyJWT , subscribeToChannel);
subcriptionRouter.route('/unsubscribe/:channelId').delete(verifyJWT , unsubscribeChannel);

subcriptionRouter.route('/').get(verifyJWT ,getAllSubscriptions );
subcriptionRouter.route('/my-subscribers').get(verifyJWT ,getAllSubscribers );

export default subcriptionRouter;