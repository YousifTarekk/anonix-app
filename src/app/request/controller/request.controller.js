import {validationBody} from "../../../lib/validation/validation.js";
import {answerRequestDto, messageIdDto, requestIdDto} from "../dto/request.dto.js";
import * as requestService from '../service/request.service.js'

export async function requestIdentity(req, res, next) {
    try {
        const {messageId} = validationBody(messageIdDto, req.params);
        const createdRequest = await requestService.requestIdentity(messageId, req.user.id)
        res.status(201).json({
            status: "success",
            message: "Request sent successfully",
            data: createdRequest
        })
    } catch (error) {
        next(error)
    }
}
export async function getRequests(req, res, next) {
    try {
        const requests = await requestService.getRequests(req.user.id)
        res.status(200).json({
            status: "success",
            message: "ok",
            data: requests
        })
    } catch (error) {
        next(error)
    }
}
export async function answerRequest(req, res, next) {
    try {
        const {requestId} = validationBody(requestIdDto, req.params);
        const {status} = validationBody(answerRequestDto, req.body);
        const result = await requestService.answerRequest(requestId, req.user.id, status)
        res.status(200).json({
            status: "success",
            message: `Request ${status} successfully`,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
