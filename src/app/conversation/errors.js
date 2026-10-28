import {AppError} from "../../lib/error/error.js";

export const conversationErrors = {
    // same error whether it doesn't exist or the user isn't a participant, so we don't leak conversation ids
    conversationNotFound: new AppError("Conversation not found",404),
};
