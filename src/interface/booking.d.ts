import mongoose, { Date } from "mongoose";
import { type } from "os";
import { IUser } from "./user";
import { ITourActivities } from "./TourActivate";

type TPaymentInfo = {
    id: string,
    status: string,
    update_time: Date
}

export interface IBooking extends mongoose.Document {
    activity: mongoose.Types.ObjectId | ITourActivities,
    user: mongoose.Types.ObjectId | IUser,
    tourGuard: mongoose.Types.ObjectId | IUser,
    fName: string,
    lName: string,
    email: string,
    phoneNumber: number,
    dateBooked: string,
    timeBooked: string,
    numOfPerson: number,
    totalAmount: number,
    serviceCharge: number,
    paidAt: Date,
    paymentInfo: TPaymentInfo,
    amountPaid: number,
    createdAt: Date,
    updatedAt: Date,
}
