import mongoose from "mongoose";

export interface IFakeBooking extends mongoose.Document {
    activity: string,
    name: string,
    surname: string,
    email: string
}