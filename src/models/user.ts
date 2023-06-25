import { Request } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export interface IUserRequest extends Request {
    user?: any
}

export interface IUser extends mongoose.Document {
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

const userSchema = new mongoose.Schema({
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
userSchema.pre<IUser>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//jwt token
userSchema.methods.getJwtToken = function() {
    const user = this as IUser
    return jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword: string){
    const user = this as IUser
    return await bcrypt.compareSync(enteredPassword, user.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;