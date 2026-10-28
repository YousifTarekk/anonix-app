import {validationBody} from "../../../lib/validation/validation.js";
import {conversationIdDto, sendConversationMessageDto} from "../dto/conversation.dto.js";
import * as conversationService from '../service/conversation.service.js'

export async function getConversations(req, res, next) {
    try {
        const conversations = await conversationService.getConversations(req.user.id)
        res.status(200).json({
            status: "success",
            message: "ok",
            data: conversations
        })
    } catch (error) {
        next(error)
    }
}
export async function sendMessage(req, res, next) {
    try {
        const {conversationId} = validationBody(conversationIdDto, req.params);
        const {content} = validationBody(sendConversationMessageDto, req.body);
        const createdMessage = await conversationService.sendMessage(conversationId, req.user.id, content)
        res.status(201).json({
            status: "success",
            message: "Message successfully created",
            data: createdMessage
        })
    } catch (error) {
        next(error)
    }
}
export async function getMessages(req, res, next) {
    try {
        const {conversationId} = validationBody(conversationIdDto, req.params);
        const messages = await conversationService.getMessages(conversationId, req.user.id)
        res.status(200).json({
            status: "success",
            message: "ok",
            data: messages
        })
    } catch (error) {
        next(error)
    }
}
