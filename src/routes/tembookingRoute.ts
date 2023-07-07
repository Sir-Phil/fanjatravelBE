import express from "express";
import { temUserBooking } from "../controllers/t-user";

const router = express.Router();

router.post("/create-temp-user", temUserBooking);


export default router;