import { Request } from "express"
import mongoose from "mongoose"
import { LanguageOptions } from "./languageOption";
import { activitiesOpt } from "./activityTogether";

export interface IUserRequest extends Request {
    user?: any
}

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName:string;
    age: string;
    gender: Gender;
    language: typeof LanguageOptions[number][];
    activities: typeof activitiesOpt[number][];
    email: string;
    password: string;
    avatar?: string;
    phoneNumber: number;
    address: string;
    country: string;
    motto: string;
    isAdmin: boolean;
    isTourGuard: boolean;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<Boolean>;
    getJwtToken(): string;
}
