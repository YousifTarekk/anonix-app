import * as authRepository from "../repo/auth.repo.js";
import * as otpRepository from "../repo/otp.repo.js";
import * as userRepository from "../../user/repo/user.repo.js";
import {toMs} from "../../../pkg/utils/time.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../lib/email/nodemailer.js";
import {userErrors} from "../errors.js";
import {generateOTP} from "../../../lib/utils/otp.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";
import e from "express";
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {email} from "zod";
import {createUser} from "../repo/auth.repo.js";
import {mailjetProvider} from "../../../lib/email/init.js";


export async function register(userData) {
    const userExist = await authRepository.checkUserByEmail(userData.email);

    if (userExist) {
        throw userErrors.userAlreadyExists;
    }

    userData.password = await hashPassword(userData.password);

    const createdUser = await authRepository.createUser(userData);

    const otp = generateOTP();

    await otpRepository.createOtp({
        code: otp,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMs(5, "minutes")),
    });

    await mailjetProvider.sendEmail(
        userData.email,
        "verification email",
        `<h1>Your verification code is ${otp}</h1>`
    );

    return createdUser;
}

export async function verifyAccount(email, code) {
    const userExist = await authRepository.checkUserByEmail(email);

    if (!userExist) {
        throw userErrors.userNotFound;
    }

    if (userExist.isVerified === true) {
        throw userErrors.alreadyVerified;
    }

    const otp = await otpRepository.getOtpByEmail(email);

    if (!otp) {
        throw userErrors.otpExpired;
    }

    if (otp.code !== code) {
        throw userErrors.invalidOtp;
    }

    const updateUser = await userRepository.updateUser(email, {
        isVerified: true,
    });

    await otpRepository.deleteOtp(email);

    return updateUser;
}

export async function login(email, password) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;

    if (user.isVerified === false) {
        throw userErrors.userNotVerified;
    }

    const match = await comparePassword(password,user['password']);

    if (!match) throw userErrors.invalidPassword;


    return generateToken({id: user._id,name:user.name});
}

export async function sendOTP(email) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;

    await otpRepository.deleteOtp(email);

    const code = generateOTP();

    await otpRepository.createOtp({
        code: code,
        email: email,
        expiresAt: new Date(Date.now() + toMs(3, "minutes")),
    });

    await mailjetProvider.sendEmail(
        email,
        "new otp",
        `<p>your new otp is ${code}</p>`
    );
}

export async function resetPassword(email,code,newPassword) {
    //1.verify otp code
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp)throw userErrors.otpExpired;
    if (otp.code!== code)throw userErrors.invalidOtp;

    //2.hash password
    const hashedPassword=await hashPassword(newPassword);
    //3.update password
    await userRepository.updateUser(email,{password:hashedPassword});
    //4.delte otp
    await otpRepository.deleteOtp(email);

}
export async function loginWithGoogle(idToken) {
    //1.verify id token
    const payLoad = await verifyGoogleToken(idToken);

    //2.check user exist
    const user = await authRepository.checkUserByEmail(payLoad.email);

    //3.if user exist==>generate token
    if (user) {
        return generateToken({
            id: user._id,
            email: user.email,
        });
    }

    //4.if not exist==>create user&generate token
    const createdUser = await authRepository.createUser({
        name: payLoad.name,
        email: payLoad.email,
        provider: "google",
        isVerified: true,
    });

    return generateToken({
        id: createdUser._id,
        email: createdUser.email,
    });
}