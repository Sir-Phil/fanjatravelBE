import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendMail";
import Booking from "../models/booking";
import { IUserRequest } from "../interface/user";
import User from "../models/user";
import Activities from "../models/tourActivity";
import { IBooking } from "../interface/booking";
import createPayPalPayment from "../utils/paypalIntegration";


//const serviceCharge = 10;
// POST /api/bookings
const newBooking = asyncHandler(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const {
        activity,
        fName,
        lName,
        email,
        phoneNumber,
        dateBooked,
        timeBooked,
        numOfPerson,
        amountPaid,
        serviceCharge,
        paymentInfo,
      } = req.body;

      const tourGuardId = req.body.tourGuardId;

      // Fetch the activity details based on the provided activity ID
      const activityDetails = await Activities.findById(activity);
      if (!activityDetails) {
        return next(new ErrorHandler("Activity not found", 404));
      }

      // Fetch the tour guide details based on the provided tourGuardId
      const tourGuideDetails = await User.findById(tourGuardId);
      if (!tourGuideDetails) {
        return next(new ErrorHandler("Tour guide not found", 404));
      }

      // Ensure serviceCharge is a valid number
      const parsedServiceCharge: number = parseFloat(serviceCharge);
      if (isNaN(parsedServiceCharge) || parsedServiceCharge < 0) {
        res
          .status(400)
          .json({ success: false, message: "Invalid serviceCharge" });
      }

      // Ensure numOfPerson is a valid number
      const numberOfPersons: number = parseInt(numOfPerson, 10);
      if (isNaN(numberOfPersons) || numberOfPersons <= 0) {
        res
          .status(400)
          .json({ success: false, message: "Invalid number of persons" });
      }

      // Ensure amountPaid is a valid number
      const paidAmount: number = parseFloat(amountPaid);
      if (isNaN(paidAmount) || paidAmount <= 0) {
        res.status(400).json({ success: false, message: "Invalid amountPaid" });
      }

      // Calculate the total amount for the booking based on the activity base price and number of persons
      const totalAmount: number = (paidAmount * numberOfPersons) + serviceCharge;
      console.log('paidAmount:', paidAmount);
      console.log('numberOfPersons:', numberOfPersons);
      console.log('serviceCharge:', serviceCharge);

      //Create a new booking
      const booking = new Booking({
        activity: activityDetails._id,
        tourGuard: tourGuideDetails._id,
        email,
        fName,
        lName,
        phoneNumber,
        dateBooked,
        timeBooked,
        numOfPerson: numberOfPersons,
        amountPaid: paidAmount,
        paymentInfo,
        paidAt: Date.now(),
        totalAmount,
        serviceCharge,
      });

      await booking.save();

      const approvalUrl: string = await createPayPalPayment(paidAmount, false, totalAmount);

      // Email function for the user wait-list
      await sendMail({
        email: booking.email,
        subject: "We Appreciate your interest to join this Tour Experience",
        message: `<p>Hello, ${fName}</p>
            <p>Thank you for showing interest to be part of the Tour Experience. Please watch out for this space for more vital information and Experience updates:</p>
            <p>Your Booking Information:</p>
            <p>Booking ID: ${booking._id}</p>
            <p>Activity Booked: ${activityDetails.activityTitle}</p>
            <p>Tour Guard: ${tourGuideDetails.firstName}</p>
            <p>Date Booked: ${dateBooked}</p>
            <p>Service Fee: ${serviceCharge}</p>
            <p>Amount Paid: ${totalAmount}</p>
            <p>We offer the best Tour Experience</p>
            <p>Best regards,</p>
            <p>The Admin Team</p>`,
      });
      res.redirect(approvalUrl);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// GET /api/myBookings
const myBookings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch bookings without requiring the user ID
      const myBookings = await Booking.find({})
        .populate("activity") // Populate the 'activity' field with activity details
        .populate("tourGuard"); // Populate the 'tourGuard' field with tour guide details

      res.status(200).json({
        success: true,
        data: myBookings,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Endpoint to retrieve a booking using the booking code
const myBookingId = asyncHandler(async (req: Request, res: Response) => {
  const bookingCode = req.params.bookingCode;

  try {
    // Fetch the booking based on the provided booking code
    const booking: IBooking | null = await Booking.findOne({ bookingCode });

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// @Desc Delete booking 
// @Route /api/bookings/:id
// @Method DELETE
//@access Admin
const deleteBooking = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingId = req.params.bookingId;
      const booking = await Booking.findById(bookingId);

      console.log('Booking ID:', req.params.bookingId);
        console.log('Found Booking:', bookingId);

      if (!booking) {
          res.status(404);
          throw new Error("Booking not found");
      }

      await Booking.findByIdAndDelete(bookingId);

      res.status(200).json({ success: true, message: "Deleted Successfully" }); // Use 204 (No Content) for successful deletion with no content in the response
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
  }
});


export { newBooking, myBookings, myBookingId, deleteBooking };
