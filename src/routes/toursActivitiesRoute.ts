import express from "express";
import { getActivityById, getAll, getTopTourByReview, searchActivities, createActivity, getActivitiesByTourGuide } from "../controllers/tourActivity";
import { isAdmin, isAuthenticated, isTourGuard } from "../middleware/auth";


const router = express.Router();

router.get("/", getAll);
router.get("/single/:id", getActivityById);
router.get("/search-tour", searchActivities);
router.get("/top-tour", getTopTourByReview);
router.post("/create-activity", isAuthenticated, isTourGuard, createActivity);
router.get("/get-activity-created-tour-guide", isAuthenticated, isTourGuard, getActivitiesByTourGuide)


export default router;