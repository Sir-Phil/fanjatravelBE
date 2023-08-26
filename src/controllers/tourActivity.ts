import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Activities from "../models/tourActivity";
import Category from "../models/category";
import { IImage, ITourActivities } from "../interface/TourActivate";
import { IUserRequest } from "../interface/user";
import User from "../models/user";
import ErrorHandler from "../utils/ErrorHandler";
import { deleteImageFromCloudinary, updateImageOnCloudinary, uploadImageToCloudinary } from "./imageController";



// @Desc Get All Activities
// @Route /api/tour-activities
// @Method GET
const getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category; // Assuming the category parameter is passed in the request URL
  
    let query = {};

    if (category) {
      // Find the category document by name
      const categoryItem = await Category.findOne({ title: category });

      // If category is found, include it in the query
      if (categoryItem) {
        query = { category: categoryItem._id };
      }
    }

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Activities.countDocuments(query);

    const tourActivities = await Activities.find(query)
      .populate("category", "title")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .exec();


      const formattedActivities = tourActivities.map(activity => ({
        ...activity.toObject(),
        images: activity.images.map((image: IImage) => ({
          url: image.url,
          _id: image._id
        }))
      }));  

    res.status(200).json({
      success: true,
      activities: formattedActivities,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Error retrieving tour activities by category",
    });
  }
});


const getActivityById = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const activityId = req.params.id;

    const activity = await Activities.findById(activityId);

    if (!activity) {
      res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: activity,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
};

// @Desc Search Tour activities
// @Route /api/activities/search-tour/
// @Method GET
const searchActivities = asyncHandler(async (req: Request, res: Response) => {
  try {
    const filtered = await Activities.find({
      $and: [
        {
          $or: [
            { name: req.query.keyword },
            { description: req.query.keyword },
          ],
        },
        { activityType: req.query.activityType },
        { category: req.query.title },
      ],
    });
    res.status(201).json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to search tourist activities",
    });
  }
});

const getTopTourByReview = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const topTour = await Activities.find().sort({ rating: 1 }).limit(10);

      res.status(200).json({
        success: true,
        data: topTour,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "failed to fetch to to by review",
      });
    }
  }
);


// @Route /api/activities/create-activities/
// @Method POST/ @Desc  activities
// @Access TourGuide
const createActivity = asyncHandler(
  async (req: IUserRequest, res: Response, _next: NextFunction) => {
    try {

      const uploadedImages = req.files as Express.Multer.File[];
      if (uploadedImages.length !== 5) {
        res.status(400).json({
          success: false,
          error: "Please upload exactly 5 images",
        });
        return;
      }

      const imageResults = await Promise.all(
        uploadedImages.map(uploadImageToCloudinary)
      );
      
      const {
        activityTitle,
        activityLocation,
        activityType,
        period,
        dayOfActivity,
        describeActivity,
        activityDays,
        activityFee,
        discount,
        activityPlan,
        category,
      } = req.body;

      // const parsedActivityPlan = Array.isArray(activityPlan) ? activityPlan : [];

      const newTourActivity: ITourActivities = await Activities.create({
        activityTitle,
        activityLocation: JSON.parse(activityLocation),
        activityType,
        period,
        dayOfActivity,
        describeActivity,
        activityDays,
        activityFee,
        discount,
        activityPlan: JSON.parse(activityPlan),
        images : imageResults,
        category: JSON.parse(category),
        tourGuard: req.user._id,
      });

      res.status(201).json({
        success: true,
        data: newTourActivity,
      });
    } catch (error: any) {
       console.error(error);
      res.status(500).json({ error: error.message,
        success: false,
        message: 'Error Creating Activities'
       });
    }
  }
);

//@Desc get all tour-activities
// @Route /api/user/tour-activities/
// @Method GET
//@access TourGuard

const GetTour = asyncHandler(async (req: Request, res: Response) => {
  try {
    const tourActivities: ITourActivities[] = await Activities.find();

    res.status(200).json({
      success: true,
      data: tourActivities,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//@Desc get tour-activities by id
// @Route /api/user/tour-activities/:id
// @Method GET
//@access TourGuard

const getTourById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const activityId: string = req.params.activityId;
      const tourActivity: ITourActivities | null = await Activities.findById(
        activityId
      );

      if (!tourActivity) {
        res.status(404).json({
          success: false,
          message: "Tour activity not found",
        });
      }

      res.status(200).json({
        success: true,
        data: tourActivity,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//@Desc Update tour-activities by id
// @Route /api/user/tour-activities/:id
// @Method PUT
//@access TourGuard

const updateActivity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activityId: string = req.params.activityId;
      const updateData: Partial<ITourActivities> = req.body;

      const tourActivity: ITourActivities | null =
        await Activities.findByIdAndUpdate(activityId, updateData, {
          new: true,
        });

      if (!tourActivity) {
        res.status(404).json({
          success: false,
          message: "Tour activity not found",
        });
      }

      res.status(200).json({
        success: true,
        data: tourActivity,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//@Desc Update tour-activities by id
// @Route /api/user/tour-activities/:id
// @Method PUT
//@access TourGuard

const deleteActivityByID = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activityId: string = req.params.activityId;

      const tourActivity: ITourActivities | null =
        await Activities.findByIdAndDelete(activityId);

      if (!tourActivity) {
        res.status(404).json({
          success: false,
          message: "Tour activity not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

const getActivitiesByTourGuide = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user; // Assuming the authenticated user is a tour guide

    // Check if the tour guide exists
    const user = await User.findById(id);
    if (!user || !user.isTourGuard) {
    res.status(404).json({
        success: false,
        message: 'Tour Guide not found',
      });
    }

    // Retrieve activities created by the tour guide
    const activities = await Activities.find({ tourGuard: id });

    // Return the activities
    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const deleteActivityImage = asyncHandler(async( req: Request, res: Response, next: NextFunction) => {
try {
  const {activityId, imageId } = req.params;

  //function to activity by id 
  const activity = await Activities.findById(activityId);

  if(!activity) {
    res.status(404).json({error: 'Activity not found'});
    return
  }

  const imageIndex = activity.images.findIndex((image) => image._id === imageId);

  if(imageIndex === -1 ){
    res.status(404).json({error: 'Image not found'});
    return;
  }

  const publicId = activity.images[imageIndex].public_id;
  const deleteResult = await deleteImageFromCloudinary(publicId);

  if(deleteResult) {
    activity.images.splice(imageIndex, 1);
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Image delete from activity successfully'
    });
  }else{
    res.status(500).json({
      error: 'Error deleting image from Cloudinary',
      success: false,
      message: 'Error deleting image from activity',
    });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({
    error:(error as Error).message,
    success: false,
    message: 'Error deleting image from activity',
  });
}
});

const updateActivityImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activityId, imageId } = req.params;

    const activity = await Activities.findById(activityId);

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const imageIndex = activity.images.findIndex((image) => image._id === imageId);

    if (imageIndex === -1) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    const publicId = activity.images[imageIndex].public_id;

    if (!req.file) {
      res.status(400).json({ error: 'No new image uploaded' });
      return;
    }

    // Assuming you have the new image file from Multer middleware
    const newImageFile = req.file;

    // Update the image on Cloudinary and get the new image URL
    const updatedImageInfo = await updateImageOnCloudinary(publicId, newImageFile);
    const newImageUrl = updatedImageInfo.url;

    activity.images[imageIndex].url = newImageUrl;
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Image updated in activity successfully',
      data: newImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: (error as Error).message,
      success: false,
      message: 'Error updating image in activity',
    });
  }
});



export {
  getAll,
  searchActivities,
  getTopTourByReview,
  getActivitiesByTourGuide,
  // getTourActivitiesByCategory,
  getActivityById,
  GetTour,
  getTourById,
  createActivity,
  updateActivity,
  deleteActivityByID,
  deleteActivityImage,
  updateActivityImage
};
