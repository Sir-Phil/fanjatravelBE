import { Request } from "express";
import mongoose from "mongoose";

export interface ITourRequest extends Request {
    tourGuard?: any
}

export interface ITour extends mongoose.Document{
    id: string,
    name: string,
    email: string,
    password: string,
    address: string,
    phoneNumber: Number,
    role: string,
    zipCode: Number,
    avatar: string,
    createdAt: Date,
    updatedAt: Date,
    // comparePassword(enteredPassword: string): Promise<Boolean>
}