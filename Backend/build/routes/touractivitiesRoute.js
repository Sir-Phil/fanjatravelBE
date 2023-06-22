"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourActivity_1 = require("../controllers/tourActivity");
const router = express_1.default.Router();
router.route("/TourActivities").get(tourActivity_1.getAll);
router.route("/SearchTour").get(tourActivity_1.searchActivities);
router.route('/TopTours').get(tourActivity_1.getTopTourByReview);
exports.default = router;
