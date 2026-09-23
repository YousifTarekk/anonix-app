import {User} from "../model/user.model.js";

export async function updateUser(email,updateData) {
    return await User.findOneAndUpdate(
        {email:email},
        updateData,
        {returnDocument:"after"}
        )
}