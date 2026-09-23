import {config} from 'dotenv';
import './common/db/mongoose.js'
import express from 'express'
import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import {Otp} from './app/auth/model/otp.model.js'
config()

const app = express()
app.use(express.json())

app.use('/auth', authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter)

app.use((err, req, res, next) => {
    res.json({
        message: err.message,
        success: false,
        stack: err.stack
    });
});
app.listen(3000,()=>{
    console.log("Server started on port 3000")
})
