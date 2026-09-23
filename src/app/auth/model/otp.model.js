import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        length:6
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    }
},{
    timestamps:{
        createdAt:true,
        updatedAt:false,

    }
})
export const Otp = mongoose.model("Otp",otpSchema);