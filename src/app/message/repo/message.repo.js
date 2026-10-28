import {Message} from "../model/message.model.js";

export async function createMessage(content,receiver,sender){
    return await Message.create({
        content: content,
        receiver: receiver,
        sender: sender,
    })
}
export async function getAllMessages(userId) {
    return await Message.find(
        {
            receiver: userId,
            isDeleted: false
        },
        {},
        {
            populate: {
                path: "sender",
                select: "name"
            }
        }
    );
}
export async function findMessageById(id) {
    return await Message.findOne({_id: id, isDeleted: false})
}
export async function updateMessage(id, updateData) {
    return await Message.findByIdAndUpdate(id, updateData, {returnDocument: "after"})
}
