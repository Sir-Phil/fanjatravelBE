import { NextFunction, Request, Response, } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendMail";
import FakeBooking from "../models/fake-booking";



// POST /api/users/invitations/tour-guard
const temUserBooking = asyncHandler  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activity, name, surname, email } = req.body;

      const existingUser = await FakeBooking.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("Email is already registered", 400));
      }
  
      // Create a new user with the provided name, email, a
      const booking  = new FakeBooking({
        activity,
        email,
        name,
        surname
      });
  
      await booking.save();

// Email function for the user wait-list
      await sendMail({
            email: booking.email,
            subject: "We Appreciate your interest to join this Tour Experience",
            message: `<p>Hello,${name}</p>
                        <p>Thank you for showing interest to be part of the Tour Experience. Please watch out for this space for more vital information and Experience updates:</p>
                        <p>We offer the best Tour Experience</p>
                        <p>Best regards,</p>
                        <p>The Admin Team</p>`,
      });
  
      res.status(201).json({
            success: true,
            message: `please check your email:- ${booking.email} for more information`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
});


const getFakeBooking = async (req: Request, res: Response) => {
  try {
    const bookings = await FakeBooking.find();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

  
export {
  temUserBooking,
  getFakeBooking
}