import express from "express";
import { getFakeBooking, temUserBooking } from "../controllers/t-user";

const router = express.Router();

router.post("/create-temp-user", temUserBooking);
router.get("/get-temp-booking", getFakeBooking);

export default router;