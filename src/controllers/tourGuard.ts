
import { Request, Response } from "express";
import Booking from "../models/booking";
import { IUserRequest } from "../interface/user";
import asyncHandler from "express-async-handler";
import Activities from "../models/tourActivity";

const getBookingsForTourGuide = asyncHandler (async (req: IUserRequest, res: Response) => {
  try {

    console.log("req.user:", req.user);
    
     // Assuming you have the tour guide ID available in req.user
     const tourGuardId = req.user._id;

    // Find all activities created by the tour guide
    const activities = await Activities.find({ tourGuard: tourGuardId }).exec();

    // Get all bookings for these activities
    const activityIds = activities.map((activity) => activity._id);
    const bookings = await Booking.find({ activity: { $in: activityIds } }).exec();


    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings for the tour guide",
    });
  }
});

export { getBookingsForTourGuide };

