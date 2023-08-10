import mongoose from "mongoose";
import { ITouristReview } from "./Review";
import { IPlan } from "./activityPlan";
import { IUser } from "./user";
import { ICategory } from "./category";

interface IImage {
    _id: string;
    url: string;
    public_id: string;
}



export interface ITourActivities extends mongoose.Document {
    activityTitle: string;
    activityLocation: string;
    activityType: activityOptions;
    dayOfActivity: daysOption;
    period: string;
    describeActivity: string;
    activityDays: Date;
    activityFee: number;
    discount: number;
    activityPlan: IPlan;
    rating?: number;
    images: IImage[];
    reviews?: IUser[];
    numberOfReviews: number;
    category: mongoose.Types.ObjectId | ICategory;
    tourGuard: mongoose.Types.ObjectId | IUser;
    basePrice: number;
    createdAt: Date;
    updatedAt: Date;
}