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
exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_1 = __importDefault(require("../models/category"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, title, place, imageUrl } = req.body;
        const category = new category_1.default({
            name,
            title,
            place,
            imageUrl
        });
        const createdCategory = yield category.save();
        res.status(201).json({
            success: true,
            data: createdCategory,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find();
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const category = yield category_1.default.findById(categoryId);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: category,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
});
exports.getCategoryById = getCategoryById;
