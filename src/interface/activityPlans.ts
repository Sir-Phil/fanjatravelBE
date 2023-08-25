import mongoose, { Schema } from "mongoose";

interface IPlan extends mongoose.Document{
    address: string,
    describeLocation: string;
    planTitle: string;
    planTitleDesc: string;
}

export const activityPlanSchema: Schema<IPlan> = new Schema({
    describeLocation:{
        type: String,
        required: [true, "Please provide the activity Location"]
      },
      planTitle: {
        type: String,
        required: [true, "Please provide the activity plan title"]
      },
    planTitleDesc: {
        type: String,
        required: [true, "Please provide the activity plan description"]
    },
  
  });