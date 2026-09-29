import {AppError} from "../../common/error/error.js";

export const userErrors = {
    userNotFound: new AppError("User not found",404),
    userAlreadyExists: new AppError("User already exist",409),
    alreadyVerified: new AppError("You already verified",400),
    otpNotFound: new AppError("OTP not found, please resend OTP",404),
    invalidOtp: new AppError("wrong OTP , please resend OTP",404),
    invalidPassword:new AppError("invalid password",400),
    userNotVerified: new AppError("User not verified",403),
};
