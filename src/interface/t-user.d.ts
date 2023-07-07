import mongoose from "mongoose";

export interface ITemporalUser extends mongoose.Document {
    name: string,
    surname: string,
    email: string
}