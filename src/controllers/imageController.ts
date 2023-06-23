import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller method to retrieve an image by public ID
const getImage = asyncHandler (async (req: any, res: any) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.v2.image(publicId, {
      // Additional options if needed (e.g., width, height, crop, etc.)
    });

    res.send(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});
