import { Router } from 'express';
import * as messageController from '../message/controller/message.controller.js';
import {guard} from "../../lib/auth/guard.js";
const messageRouter = Router();
messageRouter.post('/',messageController.createMessage)
messageRouter.post('/public',guard,messageController.createMessage)
messageRouter.get('/',guard,messageController.getAllMessages)
export default messageRouter;