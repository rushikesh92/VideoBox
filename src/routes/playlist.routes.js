import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideosInPlaylist, createPlaylist, getPlaylistById, updatePlaylistInfo,removeVideosFromPlaylist, deletePlaylist, getAllPlaylistsOfUser } from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT);

playlistRouter.route('/').post(createPlaylist);
playlistRouter.route('/:playlistId').get(getPlaylistById)
                                    .patch(updatePlaylistInfo)
                                    .delete(deletePlaylist);

playlistRouter.route('/add/:playlistId').patch(addVideosInPlaylist);
playlistRouter.route('/remove/:playlistId').patch(removeVideosFromPlaylist);

playlistRouter.route('/user/:userId').get(getAllPlaylistsOfUser);

export default playlistRouter;