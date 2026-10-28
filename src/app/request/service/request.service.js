import * as requestRepository from '../repo/request.repo.js'
import * as messageRepository from '../../message/repo/message.repo.js'
import * as conversationRepository from '../../conversation/repo/conversation.repo.js'
import {requestErrors} from "../errors.js";

// receiver asks to know who sent a message
export async function requestIdentity(messageId, userId) {
    const message = await messageRepository.findMessageById(messageId)
    if (!message) throw requestErrors.messageNotFound
    if (String(message.receiver) !== String(userId)) throw requestErrors.notMessageReceiver
    if (!message.sender) throw requestErrors.anonymousSender

    const requestExist = await requestRepository.findRequestByMessage(messageId)
    if (requestExist) throw requestErrors.requestAlreadyExists

    return await requestRepository.createRequest(messageId, userId, message.sender)
}

// sender views all requests he received
export async function getRequests(userId) {
    return await requestRepository.getSenderRequests(userId)
}

// sender accepts or rejects
export async function answerRequest(requestId, userId, status) {
    const request = await requestRepository.findRequestById(requestId)
    if (!request) throw requestErrors.requestNotFound
    if (String(request.sender) !== String(userId)) throw requestErrors.notRequestSender

    // only update if still pending (prevents answering twice)
    const updatedRequest = await requestRepository.updateRequestStatus(requestId, status)
    if (!updatedRequest) throw requestErrors.requestAlreadyAnswered

    // rejected ==> identity stays hidden
    if (status === 'rejected') return {request: updatedRequest}

    // accepted ==> reveal the sender & create a conversation linked to the original message
    await messageRepository.updateMessage(request.message, {isSenderRevealed: true})
    const conversation = await conversationRepository.createConversation(
        [request.sender, request.requester],
        request.message
    )

    return {request: updatedRequest, conversation}
}
