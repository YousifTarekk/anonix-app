import * as authRepository from "../repo/auth.repo.js";
import * as userRepository from "../../user/repo/user.repo.js";
import {toMs, toSeconds} from "../../../pkg/utils/time.js";
import {userErrors} from "../errors.js";
import {generateOTP} from "../../../lib/utils/otp.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
import {cacheProvider} from "../../../lib/cache/init.js";

const MAX_LOGIN_ATTEMPTS = 5;
const BAN_MINUTES = 5;

// each purpose has its own key, so an OTP from send-otp can't be used to finish a 2-step login
const otpKey = (email, purpose = "otp") => `${purpose}:${email.trim().toLowerCase()}`;

async function storeOtp(email, code, minutes, purpose) {
    await cacheProvider.set(otpKey(email, purpose), String(code), toSeconds(minutes, "minutes"));
}

async function checkOtp(email, code, purpose) {
    const storedCode = await cacheProvider.get(otpKey(email, purpose));

    if (!storedCode) throw userErrors.otpExpired;
    if (String(storedCode) !== String(code)) throw userErrors.invalidOtp;
}

async function clearOtp(email, purpose) {
    await cacheProvider.del(otpKey(email, purpose));
}

// ---------- Services ----------
export async function baseFuction(email, code, factor, purpose) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;

    await checkOtp(email, code, purpose);

    await clearOtp(email, purpose);
    return await factor(user);
}
export async function register(userData) {
    const userExist = await authRepository.checkUserByEmail(userData.email);

    if (userExist) {
        throw userErrors.userAlreadyExists;
    }

    userData.password = await hashPassword(userData.password);

    const createdUser = await authRepository.createUser(userData);

    const otp = generateOTP();
    await storeOtp(userData.email, otp, 5);

    await mailjetProvider.sendEmail(
        userData.email,
        "verification email",
        `<h1>Your verification code is ${otp}</h1>`
    );

    return createdUser;
}

export async function verifyAccount(email, code) {
   return await baseFuction(email, code, async () => {
        const updatedUser = await userRepository.updateUser(email, {
            isVerified: true,
        });
        return updatedUser;
    })

}

// step 1: logged in user asks to enable 2-step verification ==> send OTP
export async function sendTwoStepVerificationOtp(userId) {
    const user = await userRepository.findUserById(userId);

    if (!user) throw userErrors.userNotFound;
    if (user.twoStepVerification) throw userErrors.twoStepAlreadyEnabled;

    const otp = generateOTP();
    await storeOtp(user.email, otp, 5, "enable-2step");

    await mailjetProvider.sendEmail(
        user.email,
        "enable two step verification",
        `<h3>your otp to enable two step verification is ${otp}</h3>`
    );
}

// step 2: user sends the OTP ==> enable 2-step verification
export async function enable2stepVerification(userId, code) {
    const user = await userRepository.findUserById(userId);

    if (!user) throw userErrors.userNotFound;

   return await baseFuction(user.email, code, async () => {
        const updatedUser = await userRepository.updateUser(user.email, {
            twoStepVerification: true,
        });
        return updatedUser;
    }, "enable-2step")
}
export async function verifyCodeToLoggin(email, code) {
    return await baseFuction(email, code, async (user) => {
        return generateToken({id: user._id, name: user.name})
    }, "login-2step")
}

export async function login(email, password) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;
    if (user.isVerified === false) throw userErrors.userNotVerified;

    // 1. check if the account is banned
    if (user.banUntil && user.banUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.banUntil - Date.now()) / toMs(1, "minutes"));
        throw userErrors.accountBanned(minutesLeft);
    }

    const match = await comparePassword(password, user.password);

    // 2. wrong password ==> count the attempt, ban after 5 consecutive fails
    if (!match) {
        const attempts = (user.failedLoginAttempts || 0) + 1;

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            await userRepository.updateUser(email, {
                failedLoginAttempts: 0,
                banUntil: new Date(Date.now() + toMs(BAN_MINUTES, "minutes")),
            });
            throw userErrors.accountBanned(BAN_MINUTES);
        }

        await userRepository.updateUser(email, {failedLoginAttempts: attempts});
        throw userErrors.invalidPassword;
    }

    // 3. correct password ==> reset attempts
    if (user.failedLoginAttempts > 0 || user.banUntil) {
        await userRepository.updateUser(email, {failedLoginAttempts: 0, $unset: {banUntil: 1}});
    }

    if(user.twoStepVerification==true){
        const otp = generateOTP();
        await storeOtp(email, otp, 3, "login-2step");

        await mailjetProvider.sendEmail(
            email,
            "two step verification",
            `<h3>your new otp to login is ${otp}</h3>`
        );
        return;
    }

    return generateToken({id: user._id, name: user.name});
}

export async function sendOTP(email) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;

    const code = generateOTP();
    await storeOtp(email, code, 3); // overwrites any previous OTP

    await mailjetProvider.sendEmail(
        email,
        "new otp",
        `<p>your new otp is ${code}</p>`
    );
}

export async function resetPassword(email, code, newPassword) {
    const user = await authRepository.checkUserByEmail(email);

    if (!user) throw userErrors.userNotFound;

    // 1. verify otp code
    await checkOtp(email, code);

    // 2. hash password
    const hashedPassword = await hashPassword(newPassword);

    // 3. update password
    await userRepository.updateUser(email, {password: hashedPassword});

    // 4. delete otp
    await clearOtp(email);
}

export async function loginWithGoogle(idToken) {
    // 1. verify id token
    const payload = await verifyGoogleToken(idToken);

    // 2. check user exist
    const user = await authRepository.checkUserByEmail(payload.email);

    // 3. if user exists ==> generate token
    if (user) {
        return generateToken({
            id: user._id,
            email: user.email,
        });
    }

    // 4. if not exist ==> create user & generate token
    const createdUser = await authRepository.createUser({
        name: payload.name,
        email: payload.email,
        provider: "google",
        isVerified: true,
    });

    return generateToken({
        id: createdUser._id,
        email: createdUser.email,
    });
}
