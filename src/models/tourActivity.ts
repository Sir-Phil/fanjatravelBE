import mongoose from "mongoose";
import { ITourActivities } from "../interface/TourActivate";

const TourEventSchema = new mongoose.Schema({
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
            tourist: {
                type: mongoose.Types.ObjectId,
                ref: 'Tourist',
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

    tourist: {
        type: mongoose.Types.ObjectId,
        ref: "Tourist",
        required: true,
    }
},
{
    timestamps: true
});

const TourEvent = mongoose.model<ITourActivities>("TourEvent", TourEventSchema)

export default TourEvent;