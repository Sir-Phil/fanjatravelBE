import mongoose from "mongoose";
import { ITemporalUser } from "./t-user";
import { ITourActivities } from "./TourActivate";

export interface IBookingTour extends mongoose.Document{
    activity: mongoose.Types.ObjectId | ITourActivities
    
}


