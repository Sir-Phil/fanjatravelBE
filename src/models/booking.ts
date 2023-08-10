import mongoose, { Schema } from "mongoose";
import { IBooking } from "../interface/booking";

const bookingSchema = new mongoose.Schema({
    activity: {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        required: false
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    tourGuard: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    fname: {
        type: String,
        required: false,
    },
    lName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    dateBooked: {
        type: Date,
        required: false
    },
    timeBooked: {
        type: String,
        required: false
    },
    numOfPerson: {
        type: Number,
        required: false
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
        required: false
    },
    totalAmount: {
        type: Number,
        required: false
    },
},{
    timestamps: true
})

const Booking = mongoose.model<IBooking>("Booking", bookingSchema)

export default Booking;