import mongoose, { Schema } from "mongoose";
import { ITourActivities } from "../interface/TourActivate";
import { activityOptions } from "../interface/activityOption";
import { daysOptions } from "../interface/daysOption";


const TourActivitiesSchema: Schema<ITourActivities> = new Schema({
  activityTitle: {
    type: String,
    required: [true, "Please enter the activity title!"],
  },
  activityLocation: {
    type: String,
    required: [true, "Please enter the activity location!"],
  },
  activityType: {
    type: String,
    enum: Object.values(activityOptions),
    required: [true, "Please enter the activity type!"],
  },
  dayOfActivity: {
    type: String,
    enum: Object.values(daysOptions),
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
  activityPlan: [{
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
}
],

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
  basePrice: {
    type: Number,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tourGuard: {
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
