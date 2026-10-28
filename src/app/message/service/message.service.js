import * as userRepository from '../../user/repo/user.repo.js'
import {userErrors} from "../../auth/errors.js";
import * as messageRepository from '../repo/message.repo.js'
import {AppError} from "../../../lib/error/error.js";
export async function sendMessage(content,receiver,sender){
    const user=await userRepository.findUserById(receiver)
    if(!user)throw userErrors.userNotFound
    if(sender && String(sender)===String(receiver))throw new AppError("you can't send a message to yourself",400)
    const createdMessage=await messageRepository.createMessage(content,receiver,sender)
    return hideSender(createdMessage)

}
export async function getAllMessages(userId) {
    const messages = await messageRepository.getAllMessages(userId);

    if (!messages) {
        throw new AppError('not found message', 403);
    }

    // the receiver can't know the sender unless he accepted an identity request
    return messages.map(hideSender);
}

function hideSender(message) {
    const result = message.toObject();
    result.canRequestIdentity = !!result.sender && !result.isSenderRevealed;
    if (!result.isSenderRevealed) delete result.sender;
    return result;
}
