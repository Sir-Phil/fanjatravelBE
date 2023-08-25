import mongoose from "mongoose";
import { ITouristReview } from "./Review";
import { IPlan } from "./activityPlans";
import { IUser } from "./user";
import { ICategory } from "./category";

interface IImage {
    _id: string;
    url: string;
    public_id: string;
}


interface ILocation {
    country: string;
    state: string;
}

interface ICategory {
    Id: string;
    title: string;
}



export interface ITourActivities extends mongoose.Document {
    activityTitle: string;
    activityLocation: ILocation;
    activityType: activityOptions;
    dayOfActivity: daysOption;
    period: string;
    describeActivity: string;
    activityDays: Date;
    activityFee: number;
    discount: number;
    activityPlan: IPlan[];
    rating?: number;
    images: IImage[];
    reviews?: IUser[];
    numberOfReviews: number;
    category: ICategory;
    tourGuard: mongoose.Types.ObjectId | IUser;
    basePrice: number;
    createdAt: Date;
    updatedAt: Date;
}