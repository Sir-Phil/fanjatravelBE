import express from "express";
import { deleteBooking, myBookingId, myBookings, newBooking } from "../controllers/booking";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/", newBooking);
router.get("/my-booking", myBookings);
router.get("/my-booking/:bookingId", myBookingId)
router.delete("/deleteBooking/:bookingId", isAuthenticated, isAdmin, deleteBooking)

export default router;