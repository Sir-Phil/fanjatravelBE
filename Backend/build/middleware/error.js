"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server Error";
    //wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found with id.. Invalid ${err.path}`;
        err = new ErrorHandler_1.default(message, 400);
    }
    //Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate Key ${Object.keys(err.KeyValue)} Entered`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // Wrong Jwt Error
    if (err.name === "JsonWebTokenError") {
        const message = `Your url is not invalid please try again letter`;
        err = new ErrorHandler_1.default(message, 400);
    }
    //Jwt expired
    if (err.name === "TokenExpiredError") {
        const message = `Your url is expired please try again letter`;
        err = new ErrorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.default = errorHandler;
