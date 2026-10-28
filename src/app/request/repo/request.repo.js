import {IdentityRequest} from "../model/request.model.js";

export async function createRequest(message,requester,sender){
    return await IdentityRequest.create({
        message: message,
        requester: requester,
        sender: sender,
    })
}
export async function findRequestByMessage(messageId) {
    return await IdentityRequest.findOne({message: messageId})
}
export async function findRequestById(id) {
    return await IdentityRequest.findById(id)
}
export async function getSenderRequests(senderId) {
    return await IdentityRequest.find(
        {
            sender: senderId
        },
        {},
        {
            populate: [
                {path: "requester", select: "name"},
                {path: "message", select: "content createdAt"}
            ],
            sort: {createdAt: -1}
        }
    );
}
export async function updateRequestStatus(id, status) {
    return await IdentityRequest.findOneAndUpdate(
        {_id: id, status: 'pending'},
        {status: status},
        {returnDocument: "after"}
    )
}
