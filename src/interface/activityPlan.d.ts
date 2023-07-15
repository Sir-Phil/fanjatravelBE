import mongoose from "mongoose";

export interface IPlan extends mongoose.Document{
    address: string,
    describeLocation: string;
    planTitle: string;
    planTitleDesc: string;
}