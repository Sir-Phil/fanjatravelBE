import express from "express";
import { getAll, getTopTourByReview, searchActivities } from "../controllers/tourActivity";


const router = express.Router();

router.route("/Activities").get(getAll);
router.route("/SearchTour").get(searchActivities);
router.route('/TopTours').get(getTopTourByReview)

export default router;