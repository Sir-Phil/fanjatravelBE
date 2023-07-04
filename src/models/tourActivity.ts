import mongoose, { Schema } from "mongoose";
import { ITourActivities } from "../interface/TourActivate";


const TourActivitiesSchema: Schema<ITourActivities> = new Schema({
  activityTitle: {
    type: String,
    required: [true, "Please enter the activity title!"],
  },
  activityType: {
    type: String,
    required: [true, "Please enter the activity type!"],
  },
  period: {
    type: String,
    required: [true, "Please enter the activity period!"],
  },
  describeActivity: {
    type: String,
    required: [true, "Please enter the activity description!"],
  },
  activityDays: {
    type: Date,
    required: [true, "Please enter the activity days!"],
  },
  activityFee: {
    type: Number,
    required: [true, "Please enter the activity fee!"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  activityPlan: {
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
  },

  rating: {
    type: Number,
  },
  images:{
        type: [String],
        required: true,
    },

  reviews:[{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the Tour Guard!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Activities = mongoose.model<ITourActivities>(
  "Activities",
  TourActivitiesSchema
);

export default Activities;
