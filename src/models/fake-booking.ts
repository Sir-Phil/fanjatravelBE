import mongoose from "mongoose";
import { IFakeBooking } from "../interface/fake-booking";

const fakeBookingSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Activity"
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
},{
    timestamps: true
})

const FakeBooking = mongoose.model<IFakeBooking>("FakeBooking", fakeBookingSchema)

export default FakeBooking;