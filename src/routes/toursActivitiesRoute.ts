import express from "express";
import { getActivityById, getAll, getTopTourByReview, searchActivities, createActivity, getActivitiesByTourGuide, deleteActivityImage, updateActivityImage } from "../controllers/tourActivity";
import { isAuthenticated, isTourGuard } from "../middleware/auth";
import upload from "../utils/multer";


const router = express.Router();

router.get("/", getAll);
router.get("/single/:id", getActivityById);
router.get("/search-tour", searchActivities);
router.get("/top-tour", getTopTourByReview);
router.post("/create-activity", isAuthenticated, isTourGuard, upload.array("images", 5), createActivity);
router.get("/activity-tour-guide", isAuthenticated, isTourGuard, getActivitiesByTourGuide);
router.delete("/:activityId/images/:imageId", isAuthenticated, isTourGuard, deleteActivityImage);
router.put("/:activityId/images/:imageId", isAuthenticated, isTourGuard, upload.single('newImage'), updateActivityImage)


export default router;