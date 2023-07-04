// import { NextFunction, Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import Activity from "../models/tourActivity";
// import { ITourActivities } from "../interface/TourActivate";
// import { IUserRequest } from "../interface/user";







// //@Desc Create a new tour-activities
// // @Route /api/user/create-tour/
// // @Method POST
// // @access TourGuard
// const createTour = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
//   try {
//     const {
//       activityTitle, 
//       activityType, 
//       period, 
//       describeActivity,
//       activityDays,
//       activityFee,
//       discount,
//       activityPlan,
//       category,
//       images
//     } = req.body
  
//     const newTour: ITourActivities = await Activity.create({
//       activityTitle,
//       activityType,
//       period,
//       describeActivity,
//       activityDays,
//       activityFee,
//       discount,
//       activityPlan,
//       images,
//       category,
//       createdBy: req.user.id,
//     });
  
//     res.status(201).json({
//       success: true,
//       data: newTour,
//     });
//   } catch (error: any) {
//     res.status(500).json({error: error.message});
//   }
// });

// //@Desc get all tour-activities
// // @Route /api/user/tour-activities/
// // @Method GET
// //@access TourGuard

// const GetTour = asyncHandler (async (req: Request, res: Response) => {
//   try {
//     const tourActivities: ITourActivities[] = await Activity.find();

//     res.status(200).json({
//       success: true,
//       data: tourActivities,
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// //@Desc get tour-activities by id
// // @Route /api/user/tour-activities/:id
// // @Method GET
// //@access TourGuard

// const getTourById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const tourActivityId: string = req.params.id;
//     const tourActivity: ITourActivities | null = await Activity.findById(tourActivityId);

//     if (!tourActivity) {
//       res.status(404).json({
//         success: false,
//         message: "Tour activity not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: tourActivity,
//     });
//   } catch (error: any) {
//     res.status(500).json({error: error.message})
//   }
// })

// //@Desc Update tour-activities by id
// // @Route /api/user/tour-activities/:id
// // @Method PUT
// //@access TourGuard

// const updateTour = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const tourActivityId: string = req.params.id;
//     const updateData: Partial<ITourActivities> = req.body;

//     const tourActivity: ITourActivities | null = await Activity.findByIdAndUpdate(
//       tourActivityId,
//       updateData,
//       { new: true }
//     );

//     if (!tourActivity) {
//        res.status(404).json({
//         success: false,
//         message: "Tour activity not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: tourActivity,
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });


// //@Desc Update tour-activities by id
// // @Route /api/user/tour-activities/:id
// // @Method PUT
// //@access TourGuard

// const deleteTourById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
//   try {
//     const tourActivityId: string = req.params.id;

//     const tourActivity: ITourActivities | null = await Activity.findByIdAndDelete(tourActivityId);

//     if (!tourActivity) {
//       res.status(404).json({
//         success: false,
//         message: "Tour activity not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Deleted Successfully"
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// })


// export {
//     createTour,
//     GetTour,
//     getTourById,
//     deleteTourById,
//     updateTour,
// }