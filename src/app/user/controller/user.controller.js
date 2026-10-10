import {uploadSingleFile} from "../../../lib/media/multer.js";
import {allowedFields, fileValidation} from "../../../lib/media/file.validation.js";
import userRouter from "../user.route.js";
import * as userService from "../service/user.service.js";

export const uploadProfilePic=async (req, res, next) => {
    try {
        await userService.uploadProfilePic(req.user.id, req.file);
        res.json({message:"upload success",success:true})
    } catch (error) {
        next(error);
    }
};