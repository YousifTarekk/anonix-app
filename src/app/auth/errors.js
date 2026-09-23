export const userErrors = {
    userNotFound: new Error("User not found"),
    userAlreadyExists: new Error("User already exist"),
    alreadyVerified: new Error("You already verified"),
    otpNotFound: new Error("OTP not found, please resend OTP"),
    invalidOtp: new Error("OTP expired, please resend OTP"),
    invalidPassword:new Error("invalid password"),
    userNotVerified: new Error("User not verified"),
};