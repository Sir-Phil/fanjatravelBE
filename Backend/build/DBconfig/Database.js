"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = () => {
    mongoose_1.default.connect(process.env.DB_PATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((data) => {
        console.log(`mongoDB connected successfully with server: ${data.connection.host}`);
    });
};
exports.default = dbConnection;
