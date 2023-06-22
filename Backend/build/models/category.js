"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
