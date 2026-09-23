import * as authRepository from "../repo/auth.repo.js";
import * as otpRepository from "../repo/otp.repo.js";
import * as userRepository from "../../user/repo/user.repo.js";
import {toMs} from "../../../common/utils/time.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../common/email/nodemailer.js";
import {userErrors} from "../errors.js";
import {generateOTP} from "../../../common/utils/otp.js";


export async function register(userData) {
    const userExist = await authRepository.checkUserByEmail(userData.email);

    if (userExist) {
        throw userErrors.userAlreadyExists;
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    const createdUser = await authRepository.createUser(userData);

    const otp = generateOTP();

    await otpRepository.createOtp({
        code: otp,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMs(5, "minutes")),
    });

    await sendEmail(
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
        throw userErrors.otpNotFound;
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
    //1-check user existence
    const user = await authRepository.checkUserByEmail(email);
    if (!user)throw userErrors.userNotFound;
    //1.2 check user verified
    if(user.isVerified === false) throw userErrors.userNotVerified
    //2-compare password
    const match=bcrypt.compare(password,user.password);
    if(!match)throw userErrors.invalidPassword
    //3-generate token
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name,
    },
        process.env.JWT_SECRET,
        {expiresIn:toMs(1,"hours")}
        );
    return token;

}
export async function sendOTP(email){
    //1-check user existence
    const user=await authRepository.checkUserByEmail(email);
    if(!user)throw userErrors.userNotFound;
    //2-delete all old otp
    await otpRepository.deleteOtp(email);
    //3-generat otp and save to DB
    const code=generateOTP()
    await otpRepository.createOtp({
        code: code,
        email:email,
        expiresAt: new Date(Date.now() + toMs(3, "minutes")),
    });
    //4-send email
    await sendEmail(email, 'new otp', `<p>your new otp is ${code}</p>`)
}