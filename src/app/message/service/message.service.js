import * as userRepository from '../../user/repo/user.repo.js'
import {userErrors} from "../../auth/errors.js";
import * as messageRepository from '../repo/message.repo.js'
import {AppError} from "../../../lib/error/error.js";
import {Message} from "../model/message.model.js";
export async function sendMessage(content,receiver,sender){
    const user=await userRepository.findUserById(receiver)
    if(!user)throw userErrors.userNotFound
    return await messageRepository.createMessage(content,receiver,sender)

}
export async function getAllMessages(userId) {
    const messages = await messageRepository.getAllMessages(userId);

    if (!messages) {
        throw new AppError('not found message', 403);
    }

    return messages;
}