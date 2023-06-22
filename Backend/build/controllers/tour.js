"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.LoginGuard = exports.getTour = exports.logoutGuard = exports.activateGuard = exports.createTourGuard = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tour_1 = __importDefault(require("../models/tour"));
const fs_1 = __importDefault(require("fs"));
const jwt = __importStar(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const TourToken_1 = __importDefault(require("../utils/TourToken"));
// create Tour
const createTourGuard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const tourGuardEmailEmail = yield tour_1.default.findOne({ email });
        if (tourGuardEmailEmail) {
            if (req.file) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
                return next(new ErrorHandler_1.default("User already exists", 400));
            }
        }
        if (!req.file) {
            return next(new ErrorHandler_1.default('No file provided', 400));
        }
        const filename = req.file.filename;
        const fileUrl = path_1.default.join(filename);
        const tourGuard = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };
        const activationToken = createActivationToken(tourGuard);
        const activationUrl = `http://localhost:3000/${activationToken}`;
        try {
            yield (0, sendMail_1.default)({
                email: tourGuard.email,
                subject: "Activate your touring account",
                message: `Howdy ${tourGuard.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${tourGuard.email} to activate your account`,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
            else {
                return next(new ErrorHandler_1.default("Unexpected", error));
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected", error));
        }
    }
})
//   const {
//     name,
//     email,
//     password,
//     address,
//     phoneNumber,
//     zipCode
//   } = req.body as ITour
//   const tourGuardEmailEmail = (await Tour.findOne({email})) as ITour
//   if(tourGuardEmailEmail){
//     res.status(400);
//     throw new Error('Tour Guide with Email Already Exist');
//   }else {
//     const tourGuard = (await Tour.create({
//         name, email, password, address, phoneNumber, zipCode
//     })) as ITour;
//   }
);
exports.createTourGuard = createTourGuard;
// create activation token
const createActivationToken = (tourGuard) => {
    return jwt.sign(tourGuard, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};
// Activate Guard
const activateGuard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token } = req.body;
        const newTourGuard = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (!newTourGuard) {
            return next(new ErrorHandler_1.default("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } = newTourGuard;
        let tourGuard = yield tour_1.default.findOne({ email });
        if (tourGuard) {
            return next(new ErrorHandler_1.default("User already exists", 400));
        }
        tourGuard = yield tour_1.default.create({
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber,
        });
        (0, TourToken_1.default)(tourGuard, 201, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Unexpected", 500));
    }
}));
exports.activateGuard = activateGuard;
//Login Guard
const LoginGuard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please provide the all fields!", 400));
        }
        const tourGuard = yield tour_1.default.findOne({ email }).select("+password");
        if (!tourGuard) {
            return next(new ErrorHandler_1.default("User doesn't exists!", 400));
        }
        const isPasswordValid = yield tourGuard.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default("Please provide the correct information", 400));
        }
        (0, TourToken_1.default)(tourGuard, 201, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Unexpected", 500));
    }
}));
exports.LoginGuard = LoginGuard;
//Load  Tour
const getTour = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tourGuard = yield tour_1.default.findById(req.tourGuard._id);
        if (!tourGuard) {
            return next(new ErrorHandler_1.default("User doesn't exists", 400));
        }
        res.status(200).json({
            success: true,
            tourGuard,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Unexpected", 500));
    }
}));
exports.getTour = getTour;
//Log out from Shop 
const logoutGuard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(201).json({
            success: true,
            message: "Log out successful!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Unexpected", 500));
    }
}));
exports.logoutGuard = logoutGuard;
