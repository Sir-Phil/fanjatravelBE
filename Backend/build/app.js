"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_1 = __importDefault(require("./middleware/error"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
//imports for routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const touractivitiesRoute_1 = __importDefault(require("./routes/touractivitiesRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "./uploads")));
app.use("/test", (req, res) => {
    res.send("HI");
});
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
//api endpoint routes
app.use("/api/user", userRoutes_1.default);
app.use("/api/activities", touractivitiesRoute_1.default);
app.use("/api/category", categoryRoute_1.default);
//configurations
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    });
}
//for ErrorHandling
app.use(error_1.default);
exports.default = app;
