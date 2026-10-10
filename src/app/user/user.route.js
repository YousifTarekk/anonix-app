import { Router } from 'express';
import {withCache} from "../../lib/cache/withCache.js";
import {User} from "./model/user.model.js";
import {uploadFilesArray, uploadSingleFile} from "../../lib/media/multer.js";
import {allowedFields, fileValidation} from "../../lib/media/file.validation.js";
import {guard} from "../../lib/auth/guard.js";
import * as userController from "./controller/user.controller.js";

const userRouter = Router();
userRouter.get(
    '/get-all-users',
    withCache(),
    async (req, res, next) => {
        const users = await User.find();

        res.json(users);
    }
);
userRouter.post('/upload-profile-pic',
    guard, uploadSingleFile('pp'),
    fileValidation(),
    userController.uploadProfilePic

);


userRouter.post('/upload-cv', uploadSingleFile('cv',allowedFields.files),
    fileValidation(allowedFields.files),
    (req, res, next) => {
    res.json('ok');
});

userRouter.post('/upload-cover-images', uploadFilesArray('cover-images'), (req, res, next) => {
    console.log(req.files);
    res.json('ok');
});
export default userRouter;