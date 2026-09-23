import {Otp} from "../model/otp.model.js"
export async function createOtp(otpData){
    return await Otp.create(otpData)
}
export async function getOtpByEmail(email){
    return await Otp.findOne({
        email:email
    })
}
export async function deleteOtp(email){
    return await Otp.deleteMany({
        email:email
    })
}