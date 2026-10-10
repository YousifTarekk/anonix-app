import * as authService from '../service/auth.service.js'
import {toMs} from "../../../pkg/utils/time.js";
import {validationBody} from "../../../lib/validation/validation.js";
import {loginDTO, registerDTO, resetPasswordDTO, sendDTO, verifyAccountDTO} from "../dto/auth.dto.js";

export async function register(req,res,next) {
    try {
        const data=validationBody(registerDTO,req.body)
        const createdUser=await authService.register(data)
        res.status(201).json({
            status:"success",
            message:"User created successfully",
            data:createdUser
        })
    } catch (error) {
        next(error)
    }
}
export async function verifyAccount(req,res,next) {
    try {
        const data=validationBody(verifyAccountDTO,req.body)
        const {email,code} = data;
        const updatedUser=await authService.verifyAccount(email,code)
        res.json({success:true,message:"User verified successfully",data:updatedUser})
    }catch (error) {
        next(error)
    }
}
export async function login(req,res,next) {
    try {
        const data=validationBody(loginDTO,req.body)
        const {email,password} = data;
        const token=await authService.login(email,password)
        res.cookie('access_token',token,{httpOnly:true,maxAge:toMs(1,'hours')})
        res.json({success:true,message:"Login successfully"})

    }catch (error) {
        next(error)
    }
}
export async function sendOTP(req,res,next) {
    try {
        const data=validationBody(sendDTO,req.body);
        const {email}=data;
        await authService.sendOTP(email);
        res.json({success:true,message:"OTP sent successfully,check your email"})
    }catch (error) {
        next(error)
    }
}
export async function resetPassword(req,res,next) {
    try {
        const data=validationBody(resetPasswordDTO,req.body)
        const {email,code,newPassword} = data;
        await authService.resetPassword(email,code,newPassword);
        res.json({success:true,message:"Reset password successfully"})

        res.sendStatus(204)
    }catch (error) {
        next(error)
    }
}
export async function loginWithGoogle(req,res,next) {
    try {
        const token=await authService.loginWithGoogle(req.body.idToken);
        res.cookie('access_token',token,{
            httpOnly:true,maxAge:toMs(1,'hours')
        })
        res.json({success:true,message:"Login successfully"})
    }catch (error) {
        next(error)
    }
}