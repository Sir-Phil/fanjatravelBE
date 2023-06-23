import { Request, Response } from "express";
import Category from "../models/category";


const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, title, place, imageUrl } = req.body;

    const category = new Category({
      name,
      title,
      place,
      imageUrl
    });

    const createdCategory = await category.save();

    res.status(201).json({
      success: true,
      data: createdCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: category,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

export {
  createCategory,
  getCategories,
  getCategoryById,
};
