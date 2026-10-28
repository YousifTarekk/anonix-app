import {model, Schema} from 'mongoose';
const conversationMessageSchema = new Schema({
    conversation: {
        type:Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    sender: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    }
}, {
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})
export const ConversationMessage = model('ConversationMessage', conversationMessageSchema);
