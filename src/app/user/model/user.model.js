import {model, Schema} from 'mongoose';
const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20,
        trim:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type: String,
        required: function (){
            return this.provider==='local'
        }
    },
    provider:{
        type:String,
        enum:['google','facebook','local'],
        default:'local'
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    dob:Date,
    gender:{
        type: String,
        enum: ['male','female'],
        default:'male'
    },
    profilePicPath:String,
    coverImagePaths:[String],
    cvPath:String,
    twoStepVerification:{
        type:Boolean,
        default:false
    },
    failedLoginAttempts:{
        type:Number,
        default:0
    },
    banUntil:Date,
},
    {
        timestamps:{
            createdAt: true,
            updatedAt: true,
        }

    })
export const User=model('User',userSchema);