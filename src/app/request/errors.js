import {AppError} from "../../lib/error/error.js";

export const requestErrors = {
    messageNotFound: new AppError("Message not found",404),
    notMessageReceiver: new AppError("You can only request the identity of messages sent to you",403),
    anonymousSender: new AppError("This message was sent without an account, the sender can't be revealed",400),
    requestAlreadyExists: new AppError("You already requested the identity of this message's sender",409),
    requestNotFound: new AppError("Request not found",404),
    notRequestSender: new AppError("You are not allowed to answer this request",403),
    requestAlreadyAnswered: new AppError("This request was already answered",400),
};
