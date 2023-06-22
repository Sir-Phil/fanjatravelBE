"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TourEventSchema = new mongoose_1.default.Schema({
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
                type: mongoose_1.default.Types.ObjectId,
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
        type: mongoose_1.default.Types.ObjectId,
        ref: "Tourist",
        required: true,
    }
}, {
    timestamps: true
});
const TourEvent = mongoose_1.default.model("TourEvent", TourEventSchema);
exports.default = TourEvent;
