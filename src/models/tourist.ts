import { Request } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export interface ITouristRequest extends Request {
    user?: any
}

export interface ITourist extends mongoose.Document {
    id: string,
    name: string,
    email: string,
    password: string
    avatar: string,
    phoneNumber: number,
    role: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(enteredPassword: string): Promise<Boolean>
}

const TouristSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },

    email: {
        type: String,
        required: [true, "Please enter your email!"]
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password Should be more 4 characters"],
        select: false
    },

    phoneNumber: {
        type: Number
    },

    role: {
        type: String,
        default: "user"
    },

    avatar: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt:{
        type: Date,
        default: Date.now(),
      },

    resetPasswordToken: String,
    resetPasswordTime: Date,
});

//Hash password
TouristSchema.pre<ITourist>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//jwt token
TouristSchema.methods.getJwtToken = function() {
    const user = this as ITourist
    return jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
TouristSchema.methods.comparePassword = async function(enteredPassword: string){
    const user = this as ITourist
    return await bcrypt.compareSync(enteredPassword, user.password);
}

const Tourist = mongoose.model<ITourist>("Tourist", TouristSchema);

export default Tourist;