import mongoose from "mongoose";
import { ITemporalUser } from "./fake-booking";
import { ITourActivities } from "./TourActivate";

export interface IBookingTour extends mongoose.Document{
    activity: string,
    user: string
    
}


