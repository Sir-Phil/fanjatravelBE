import express from "express";
import { createCategory, getCategories, getCategoryById } from "../controllers/category";

const router = express.Router();

router.route("/getTourCategory").get(getCategories);
router.route("/getTourCategory/:id").get(getCategoryById);
router.route("/CreateCategory").post(createCategory);

export default router;