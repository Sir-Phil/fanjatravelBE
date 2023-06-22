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
exports.getTopTourByReview = exports.searchActivities = exports.getAll = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tourActivity_1 = __importDefault(require("../models/tourActivity"));
// @Desc Get All Activities
// @Route /api/tour-activities
// @Method GET
const getAll = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = 4;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { description: { $regex: req.query.keyword, $options: "i" } },
            ]
        }
            : {};
        const tourLocation = req.query.tourLocation ? { tourLocation: req.query.tourLocation } : {};
        const category = req.query.tourType ? { category: req.query.tourType } : {};
        const count = yield tourActivity_1.default.countDocuments(Object.assign(Object.assign(Object.assign({}, keyword), tourLocation), category));
        const activities = yield tourActivity_1.default.find(Object.assign(Object.assign(Object.assign({}, keyword), tourLocation), category)).limit(pageSize)
            .skip(pageSize * (page - 1));
        res.status(201).json({
            activities,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.getAll = getAll;
// @Desc Search Tour activities
// @Route /api/activities/search-tour/
// @Method GET
const searchActivities = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filtered = yield tourActivity_1.default.find({ $and: [
                { $or: [{ name: req.query.keyword }, { description: req.query.keyword }] },
                { tourLocation: req.query.tourLocation },
                { category: req.query.tourType }
            ] });
        res.status(201).json({
            success: true,
            data: filtered,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to search tourist activities',
        });
    }
}));
exports.searchActivities = searchActivities;
const getTopTourByReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topTour = yield tourActivity_1.default.find().sort({ rating: 1 }).limit(10);
        res.status(200).json({
            success: true,
            data: topTour,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'failed to fetch to to by review',
        });
    }
}));
exports.getTopTourByReview = getTopTourByReview;
