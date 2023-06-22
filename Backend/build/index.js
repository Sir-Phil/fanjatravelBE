"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./DBconfig/Database"));
const app_1 = __importDefault(require("./app"));
//This Handle uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down for handling uncaught exception`);
});
//configurations
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    });
}
//connection to database
(0, Database_1.default)();
// here's the server
const server = app_1.default.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
//for unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Server is shutting down for ${err}`);
    console.log(`Server is shutting down for unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
