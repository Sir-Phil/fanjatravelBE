import mongoose from "mongoose";

export interface ITouristReview extends mongoose.Document {
    tourist: string,
    name: string,
    rating: Number,
}