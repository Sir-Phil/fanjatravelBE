import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Activity from "../models/tourActivity";


// @Desc Get All Activities
// @Route /api/tour-activities
// @Method GET
const getAll = asyncHandler(async(req:Request, res: Response, next: NextFunction) => {
    try {
        const pageSize = 4;
        const page = Number(req.query.pageNumber) || 1;
    
        const keyword = req.query.keyword ? {
            $or: [
                {name: { $regex: req.query.keyword, $options: "i" }},
                {description: { $regex: req.query.keyword, $options: "i" }},
            ]
        }
        : {};
    
        const tourLocation = req.query.tourLocation ? {tourLocation: req.query.tourLocation} : {};
    
        const category = req.query.tourType ? {category: req.query.tourType} : {};
    
        const count = await Activity.countDocuments({ ...keyword, ...tourLocation, ...category })
    
        const activities = await Activity.find({ ...keyword, ...tourLocation, ...category }).limit(pageSize)
        .skip(pageSize * (page - 1));
        res.status(201).json({
            activities,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// @Desc Search Tour activities
// @Route /api/activities/search-tour/
// @Method GET
const searchActivities = asyncHandler(async(req: Request, res: Response) => {
   try {
    const filtered = await Activity.find({ $and: [ 
        { $or: [{name: req.query.keyword },{description: req.query.keyword}] }, 
        {tourLocation: req.query.tourLocation}, 
        {category: req.query.tourType} 
    ] });
    res.status(201).json({
        success: true,
        data: filtered,
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        error: 'Failed to search tourist activities',
      });
   }
})

const getTopTourByReview = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const topTour = await Activity.find().sort({rating:1}).limit(10);

    res.status(200).json({
        success: true,
        data: topTour,
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'failed to fetch to to by review',
        });
    }
})


export {
    getAll,
    searchActivities,
    getTopTourByReview
}