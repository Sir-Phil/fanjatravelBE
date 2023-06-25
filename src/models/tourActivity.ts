import mongoose from "mongoose";
import { ITourActivities } from "../interface/TourActivate";

const activitySchema = new mongoose.Schema({
    tourTitle: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pricePerPerson: {
        type: Number,
        required: true,
    },
    tourLocation: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },

    rating: {
        type: Number,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            }
        }
    ],

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
{
    timestamps: true
});

const Activity = mongoose.model<ITourActivities>("Activity", activitySchema)

export default Activity;