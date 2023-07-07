import mongoose from "mongoose";
import { IBookingTour } from "../interface/booking";

const bookSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Activities"
    },

})

const Booking = mongoose.model<IBookingTour>("Booking", bookSchema)
export default Booking