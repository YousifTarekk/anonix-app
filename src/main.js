import {config} from 'dotenv';
import './common/db/mongoose.js'
import express from 'express'
import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import {Otp} from './app/auth/model/otp.model.js'
import {logger} from "./common/logger/logger.js";
import cors from "cors";
config()

const app = express()
app.use(cors({origin:"http://localhost:4200"}));
app.use(express.json())

app.use('/auth', authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter)
app.use((err, req, res, next) => {
    logger.error(err.message)
    logger.error(err);
    logger.error(err.stack);
    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }

    return res.status(500).json({
        error: "Something went wrong",
        success: false
    });
});
app.listen(3000,()=>{
    logger.info("Server started on port 3000")
})
