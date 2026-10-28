import * as authController from './controller/auth.controller.js'
import { Router } from 'express';
import {idempotency} from "../../lib/idempotency/idempotency.js";
import {guard} from "../../lib/auth/guard.js";


const authRouter = Router();
authRouter.post('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp',authController.sendOTP);
authRouter.patch('/reset-password',idempotency(), authController.resetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
authRouter.post('/enable-2step-verification',guard, authController.sendTwoStepVerificationOtp);
authRouter.patch('/confirm-2step-verification',guard, authController.enableTwoStepVerification);
authRouter.post('/verify-code-to-login', authController.verifyCodeToLogin);
export default authRouter;