import { Request } from "express";
import mongoose from "mongoose";
import bcrypt, { hashSync } from "bcrypt";
import jwt from "jsonwebtoken"

export interface IUserRequest extends Request {
    user?: any
}

export interface IUser extends mongoose.Document {
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

const UserSchema = new mongoose.Schema({
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

    resetPasswordToken: String,
    resetPasswordTime: Date,
});

//Hash password
UserSchema.pre("save", async function (next){
    const user = this as IUser
    if(!user.isModified("password")){
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
})

//jwt token
UserSchema.methods.getJwtToken = function() {
    const user = this as IUser
    return jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY || "", {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
UserSchema.methods.comparePassword = async function(enteredPassword: string){
    const user = this as IUser
    return await bcrypt.compareSync(enteredPassword, user.password);
}

const User = mongoose.model<IUser>("User", UserSchema);

export default User;