import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {v2 as cloudinaryV2} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config()


cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  try {
    const fileBufferAsString = file.buffer.toString('base64');
    const result = await cloudinaryV2.uploader.upload(`data:image/png;base64,${fileBufferAsString}`, { folder: 'uploads' });

    if (!result.url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return result.url;
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary');
  }
};

const RemoveImageFromCloudinary = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { public_id } = req.params;

    await cloudinaryV2.uploader.destroy(public_id);

    // Here, you can delete the image URL from the database for the corresponding entity (e.g., activity or user)
    // ...

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      success: false,
      message: 'Error deleting image',
    });
  }
});


export {
  uploadImageToCloudinary,
  RemoveImageFromCloudinary
} 
