import { Request } from "express"
import mongoose from "mongoose"

export interface IUserRequest extends Request {
    user?: any
}

export interface IUser extends mongoose.Document {
    name: string,
    surname:string,
    email: string,
    password: string
    avatar?: string,
    phoneNumber: number,
    address: string,
    isAdmin: boolean,
    isTourGuard: boolean,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(enteredPassword: string): Promise<Boolean>,
    getJwtToken(): string;
}
