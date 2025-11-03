import { Router } from "express";
import { addCommentOnVideo, deleteComment, getAllCommentsOnAVideo, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route('/video/:videoId').get(getAllCommentsOnAVideo);
commentRouter.route('/video/:videoId').post(addCommentOnVideo);
commentRouter.route('/:commentId').patch(updateComment);
commentRouter.route('/:commentId').delete(deleteComment);

export default commentRouter;