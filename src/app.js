import './lib/db/mongoose.js'
import express from 'express'
import cors from "cors";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";
import {correlationId} from "./lib/correlation/correlation.js";
import cookieParser from "cookie-parser";


export function createApp(){
    const app = express()
    app.use(cors({origin:"http://localhost:4200"}));
    app.use('/uploads',express.static('uploads'));
    app.use(express.json())
    app.use(cookieParser())
app.use(correlationId)
app.get('/health', (req, res,next) => {
    console.log('Health check endpoint hit');
    res.status(200).json({ status: 'ok' });
});
app.use('/api',router)
    app.use(globalErrorHandler);
return app;
}
