import {validationBody} from "../../../lib/validation/validation.js";
import {sendMessageDto} from "../dto/message.dto.js";
import * as messageService from '../service/message.service.js'

export async function createMessage(req, res, next) {
    try {
        const data=validationBody(sendMessageDto,req.body);
        const {content,receiver} = data;

        const sender = req.user?.id;

        const createdMessage=await messageService.sendMessage(content,receiver,sender)
        res.status(201).json({
            status:"success",
            message:"Message successfully created",
            data:createdMessage
        })


    }catch (error){
        next(error)
    }
}
export async function getAllMessages(req, res, next) {
    try {
        const messages = await messageService.getAllMessages(req.user.id);

       

        return res.status(200).json({
            status: "success",
            message: "ok",
            data: messages,
        });
    } catch (error) {
        next(error);
    }
}