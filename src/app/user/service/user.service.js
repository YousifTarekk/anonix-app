import {userErrors} from "../../auth/errors.js";
import * as userRepository from "../repo/user.repo.js";
import fs from 'node:fs';

export const uploadProfilePic=async (userId,file) => {
    const user = await userRepository.findUserById(userId)
    if (!user)throw userErrors.userNotFound;
    if (user.profilePicPath) {
        fs.unlinkSync(user.profilePicPath)
    }
    await userRepository.updateUser(user.email, {profilePicPath: file.path})
} 