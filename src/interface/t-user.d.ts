import mongoose from "mongoose";

export interface ITemporalUser extends mongoose.Document {
    activity: string,
    name: string,
    surname: string,
    email: string
}