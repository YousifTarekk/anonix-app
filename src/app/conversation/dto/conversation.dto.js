import {z} from 'zod';
import {Types} from "mongoose";

export const conversationIdDto = z.object({
    conversationId: z.string().trim().refine((val)=>{
        return Types.ObjectId.isValid(val)
    }, {message: "invalid id"})
})

export const sendConversationMessageDto = z.object({
    content: z.string().min(1).max(200).trim(),
})
