import { Router } from 'express';
import * as requestController from './controller/request.controller.js';
import {guard} from "../../lib/auth/guard.js";
const requestRouter = Router();
requestRouter.post('/:messageId', guard, requestController.requestIdentity)
requestRouter.get('/', guard, requestController.getRequests)
requestRouter.patch('/:requestId', guard, requestController.answerRequest)
export default requestRouter;
