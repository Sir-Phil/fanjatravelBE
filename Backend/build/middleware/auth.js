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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const tour_1 = __importDefault(require("../models/tour"));
const tourist_1 = __importDefault(require("../models/tourist"));
const isAuthenticated = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler_1.default("Please login to continue", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    req.user = yield tourist_1.default.findById(decoded.id);
    next();
}));
const isTourGuard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tourGuard_token } = req.cookies;
    if (!tourGuard_token) {
        return next(new ErrorHandler_1.default("Please login to continue", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(tourGuard_token, process.env.JWT_SECRET_KEY);
    req.tourGuard = yield tour_1.default.findById(decoded.id);
    next();
}));
const isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.default(`${req.user.role} can not access this resource!`, 500));
        }
        ;
        next();
    };
};
exports.default = {
    isAuthenticated,
    isAdmin,
    isTourGuard
};
