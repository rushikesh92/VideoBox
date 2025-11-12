import { Router } from "express";
import { getChannelStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

dashboardRouter.route('/channel/:channelId').get(getChannelStats);

export default dashboardRouter;