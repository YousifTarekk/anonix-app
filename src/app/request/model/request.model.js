import {model, Schema} from 'mongoose';
const requestSchema = new Schema({
    message: {
        type:Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
        unique: true,
    },
    // the receiver of the message who wants to know the sender
    requester: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending','accepted','rejected'],
        default: 'pending'
    }
}, {
    timestamps:{
        createdAt: true,
        updatedAt: true
    }
})
export const IdentityRequest = model('IdentityRequest', requestSchema);
