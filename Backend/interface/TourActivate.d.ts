import mongoose from "mongoose";
import { ITouristReview } from "./Review";

interface IImage {
 image: string,
}

export interface ITourActivities extends mongoose.Document {
    tourTitle: string,
    period: string,
    description: string,
    pricePerPerson: Number,
    tourLocation: string,
    rating?: Number,
    images: IImage[],
    reviews?: ITouristReview[],
    numberOfReviews: Number,
    category: ''
    tourist: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}