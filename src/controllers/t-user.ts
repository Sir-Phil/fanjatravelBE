import { NextFunction, Request, Response, } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/ErrorHandler";
import Tuser from "../models/t-user";
import sendMail from "../utils/sendMail";



// POST /api/users/invitations/tour-guard
const temUserBooking = asyncHandler  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, surname, email } = req.body;

      // Check if the email is already registered
      const existingUser = await Tuser.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("Email is already registered", 400));
      }
  
      // Create a new user with the provided name, email, and role
      const user  = new Tuser({
        email,
        name,
        surname
      });
  
      await user.save();

// Email function for the user wait-list
      await sendMail({
            email: user.email,
            subject: "We Appreciate your interest to join this Tour Experience",
            message: `<p>Hello,${name}</p>
                        <p>Thank you for showing interest to be part of the Tour Experience. Please watch out for this space for more vital information and Experience updates:</p>
                        <p>We offer the best Tour Experience</p>
                        <p>Best regards,</p>
                        <p>The Admin Team</p>`,
      });
  
      res.status(201).json({
            success: true,
            message: `please check your email:- ${user.email} to activate your account`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
});
  
export {
  temUserBooking
}