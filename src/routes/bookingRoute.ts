import express from "express";
import { deleteBooking, getAllBookingsWithTourGuard, myBookingId, myBookings, newBooking } from "../controllers/booking";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/", newBooking);
router.get("/my-booking", myBookings);
router.get("/my-booking/:bookingId", myBookingId);
router.get("/all-booking", isAuthenticated, isAdmin, getAllBookingsWithTourGuard );
router.delete("/deleteBooking/:bookingId", isAuthenticated, isAdmin, deleteBooking);

export default router;


// async function createBooking(bookingData) {
//     try {
//       const response = await fetch('/api/bookings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookingData),
//       });
  
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       throw error;
//     }
//   }
  
  
//   async function initiatePayPalPayment(paymentData) {
//     try {
//       const response = await fetch('/api/paypal/gateway', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData),
//       });
  
//       const result = await response.json();
//       return result.approvalUrl; 
//     } catch (error) {
//       console.error('Error initiating PayPal payment:', error);
//       throw error;
//     }
//   }
  
  
//   async function handleSubmit(event) {
//     event.preventDefault();
  
//     const bookingData = {
//       //NOTE here B...@@@@@@@, Populate with your booking data
//     };
  
//     try {
//       const bookingResult = await createBooking(bookingData);
  
//       if (bookingResult.success) {
//         const paymentData = {
//           //NOTE here B...@@@@@@@, Populate with payment details
//         };
  
//         const approvalUrl = await initiatePayPalPayment(paymentData);
        
//         window.location.href = approvalUrl;
//       } else {
//         console.error('Booking creation failed:', bookingResult.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  

//   const bookingForm = document.getElementById('booking-form');
//   bookingForm.addEventListener('submit', handleSubmit);
  