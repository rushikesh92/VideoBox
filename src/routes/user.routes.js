import { Router } from "express";
import { 
    registerUser,
    loginUser, 
    logoutUser,
    refreshAccessTokens, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    getUserChannelProfile,
    getWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(

    upload.fields([//middleware
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT, logoutUser )
router.route("/refresh-token").post(refreshAccessTokens);
router.route("/change-password").patch( verifyJWT , changeCurrentPassword );

router.route("/current-user").get( verifyJWT , getCurrentUser);

router.route("/update-account").patch(verifyJWT ,updateAccountDetails);
router.route("/avatar").patch( verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route("/cover-image").patch( verifyJWT, upload.single('coverImage'), updateUserAvatar );

router.route("/channel/:username").get(verifyJWT , getUserChannelProfile);
router.route("/history").get(verifyJWT , getWatchHistory);
export default router;