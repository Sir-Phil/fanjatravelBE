"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Tour name!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Tout email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        default: "TourGuid",
    },
    avatar: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
}, {
    timestamps: true
});
// Hash password
TourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password")) {
            next();
        }
        user.password = yield bcryptjs_1.default.hash(user.password, 10);
    });
});
// jwt token
TourSchema.methods.getJwtToken = function () {
    const user = this;
    return jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};
// comapre password
TourSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
const Tour = mongoose_1.default.model("Tour", TourSchema);
exports.default = Tour;
