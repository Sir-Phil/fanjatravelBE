import mongoose, { Schema } from "mongoose";
import { IBooking } from "../interface/booking";

const bookingSchema = new mongoose.Schema({
    activity: {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        // required: true
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    tourGuard: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    fname: {
        type: String,
        // required: true,
    },
    lName: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    phoneNumber: {
        type: Number,
        // required: true
    },
    dateBooked: {
        type: Date,
        // required: true
    },
    timeBooked: {
        type: String,
        // required: true
    },
    numOfPerson: {
        type: Number,
        // required: true
    },
    paymentInfo: {
        id: {type: String},
        status: {type: String},
        update_time: {type: String},
    },
    serviceCharge: {
        type: Number
    },
    paidAt: {
        type: Date,
        // required: true
    },
    totalAmount: {
        type: Number,
        // required: true
    },
},{
    timestamps: true
})

const Booking = mongoose.model<IBooking>("Booking", bookingSchema)

export default Booking;