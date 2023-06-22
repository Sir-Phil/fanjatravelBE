"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const router = express_1.default.Router();
router.route("/getTourCategory").get(category_1.getCategories);
router.route("/getTourCategory/:id").get(category_1.getCategoryById);
router.route("/CreateCategory").post(category_1.createCategory);
exports.default = router;
