import * as conversationRepository from '../repo/conversation.repo.js'
import {conversationErrors} from "../errors.js";

async function checkParticipant(conversationId, userId) {
    const conversation = await conversationRepository.findUserConversation(conversationId, userId)
    if (!conversation) throw conversationErrors.conversationNotFound
    return conversation
}

export async function getConversations(userId) {
    return await conversationRepository.getUserConversations(userId)
}

export async function sendMessage(conversationId, userId, content) {
    await checkParticipant(conversationId, userId)
    const createdMessage = await conversationRepository.createConversationMessage(conversationId, userId, content)
    await conversationRepository.touchConversation(conversationId)
    return createdMessage
}

export async function getMessages(conversationId, userId) {
    await checkParticipant(conversationId, userId)
    return await conversationRepository.getConversationMessages(conversationId)
}
