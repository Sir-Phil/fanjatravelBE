import mongoose, { Schema } from "mongoose";
import { ILocation, ITourActivities } from "../interface/TourActivate";
import { activityOptions } from "../interface/activityOption";
import { daysOptions } from "../interface/daysOption";
import { activityPlanSchema } from "../interface/activityPlans";
import { ICategory } from "../interface/category";


const LocationSchema: Schema<ILocation> = new Schema({
  country: {
    type: String,
    required: [true, "Please enter the country!"],
  },
  state: {
    type: String,
    required: [true, "Please enter the state!"],
  },
});


const categoryEntrySchema: Schema<ICategory> = new Schema({
  id: {
    type: String,
    required: [true, "Please enter the country!"],
  },
  title: {
    type: String,
    required: [true, "Please enter the state!"],
  },
});



const TourActivitiesSchema: Schema<ITourActivities> = new Schema({
  activityTitle: {
    type: String,
    required: [true, "Please enter the activity title!"],
  },
  activityLocation: LocationSchema,
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
  activityPlan: [activityPlanSchema],

  rating: {
    type: Number,
  },
  images: [
    {
      url: { type: String, required: false },
    },
  ],
  // images: {
  //   type:[String]
  // },
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
  category: categoryEntrySchema,
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
