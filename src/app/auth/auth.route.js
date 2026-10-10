import * as authController from './controller/auth.controller.js'
import { Router } from 'express';
import {idempotency} from "../../lib/idempotency/idempotency.js";


const authRouter = Router();
authRouter.post('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp',authController.sendOTP);
authRouter.patch('/reset-password',idempotency(), authController.resetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
export default authRouter;