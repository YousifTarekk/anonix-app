import {model, Schema} from 'mongoose';
const conversationSchema = new Schema({
    participants: {
        type: [{
            type:Schema.Types.ObjectId,
            ref: 'User',
        }],
        validate: [(val) => val.length === 2, 'conversation must have exactly 2 participants']
    },
    // the original anonymous message
    message: {
        type:Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
        unique: true,
    }
}, {
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})
export const Conversation = model('Conversation', conversationSchema);
