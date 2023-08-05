import express from "express";
import { getBookingsForTourGuide } from "../controllers/tourGuard";
import { isAuthenticated, isTourGuard } from "../middleware/auth";

const router = express.Router();

router.get("/bookings", isAuthenticated, isTourGuard, getBookingsForTourGuide)


export default router;