import {Conversation} from "../model/conversation.model.js";
import {ConversationMessage} from "../model/conversation-message.model.js";

export async function createConversation(participants, message) {
    return await Conversation.create({
        participants: participants,
        message: message,
    })
}
export async function getUserConversations(userId) {
    return await Conversation.find(
        {
            participants: userId
        },
        {},
        {
            populate: [
                {path: "participants", select: "name"},
                {path: "message", select: "content createdAt"}
            ],
            sort: {updatedAt: -1}
        }
    );
}
// returns the conversation only if the user is one of its participants
export async function findUserConversation(conversationId, userId) {
    return await Conversation.findOne({_id: conversationId, participants: userId})
}
export async function touchConversation(conversationId) {
    return await Conversation.findByIdAndUpdate(conversationId, {updatedAt: new Date()})
}
export async function createConversationMessage(conversation, sender, content) {
    return await ConversationMessage.create({
        conversation: conversation,
        sender: sender,
        content: content,
    })
}
export async function getConversationMessages(conversationId) {
    return await ConversationMessage.find(
        {
            conversation: conversationId
        },
        {},
        {
            populate: {
                path: "sender",
                select: "name"
            },
            sort: {createdAt: 1}
        }
    );
}
