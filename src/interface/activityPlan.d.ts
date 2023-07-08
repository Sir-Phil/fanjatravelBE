import mongoose from "mongoose";

export interface IPlan extends mongoose.Document{
    describeLocation: string;
    planTitle: string;
    planTitleDesc: string;
}