import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Activities from "../models/tourActivity";
import Category from "../models/category";
import { ITourActivities } from "../interface/TourActivate";
import { IUserRequest } from "../interface/user";
import { IPlan } from "../interface/activityPlan";
import User from "../models/user";
import ErrorHandler from "../utils/ErrorHandler";

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

    res.status(200).json({
      success: true,
      activities: tourActivities,
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
  next: NextFunction
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
  async (req: Request, res: Response, next: NextFunction) => {
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

// @access Public
// const getTourActivitiesByCategory = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const category = req.query.category; // Assuming the category parameter is passed in the request URL

//       let query = {};

//       if (category) {
//         // Find the category document by title
//         const categoryItem = await Category.findOne({ title: category });

//         // If category is found, include it in the query
//         if (categoryItem) {
//           query = { category: categoryItem._id };
//         }
//       }
//       // Retrieve tour activities based on the query
//       const tourActivities = await Activities.find(query)
//         .populate("category", "title") // Populate the category field and select only the name
//         .exec();

//       res.status(200).json({
//         success: true,
//         data: tourActivities,
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         error: "Error retrieving tour activities by category",
//       });
//     }
//   }
// );

const createActivity = asyncHandler(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
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
        images,
      } = req.body;

      const newTour: ITourActivities = await Activities.create({
        activityTitle,
        activityLocation,
        activityType,
        period,
        dayOfActivity,
        describeActivity,
        activityDays,
        activityFee,
        discount,
        activityPlan: activityPlan.map((plan : IPlan) => ({
          _id: null,
          address: plan.address,
          describeLocation: plan.describeLocation,
          planTitle: plan.planTitle,
          planTitleDesc: plan.planTitleDesc,
        })),
        images,
        category,
        user: req.user._id,
      });

      res.status(201).json({
        success: true,
        data: newTour,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tourActivityId: string = req.params.id;
      const tourActivity: ITourActivities | null = await Activities.findById(
        tourActivityId
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
      const tourActivityId: string = req.params.id;
      const updateData: Partial<ITourActivities> = req.body;

      const tourActivity: ITourActivities | null =
        await Activities.findByIdAndUpdate(tourActivityId, updateData, {
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
      const tourActivityId: string = req.params.id;

      const tourActivity: ITourActivities | null =
        await Activities.findByIdAndDelete(tourActivityId);

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
    const activities = await Activities.find({ user: id });

    // Return the activities
    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
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
};
