import mongoose from "mongoose";
import { ITouristReview } from "./Review";
import { IPlan } from "./activityPlan";
import { IUser } from "./user";
import { ICategory } from "./category";

interface IImage {
 image: string,
}



export interface ITourActivities extends mongoose.Document {
    activityTitle: string;
    activityLocation: string;
    activityType: activityOptions;
    dayOfActivity: daysOption;
    period: string;
    describeActivity: string;
    activityDays: Date;
    activityFee: Number;
    discount: Number;
    activityPlan: IPlan;
    rating?: Number;
    images: IImage[];
    reviews?: IUser[];
    numberOfReviews: Number;
    category: mongoose.Types.ObjectId | ICategory;
    user: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}