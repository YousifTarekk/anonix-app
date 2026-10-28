import {z} from 'zod';
import {Types} from "mongoose";

const objectId = z.string().trim().refine((val)=>{
    return Types.ObjectId.isValid(val)
}, {message: "invalid id"})

export const messageIdDto = z.object({
    messageId: objectId,
})

export const requestIdDto = z.object({
    requestId: objectId,
})

export const answerRequestDto = z.object({
    status: z.enum(['accepted', 'rejected']),
})
