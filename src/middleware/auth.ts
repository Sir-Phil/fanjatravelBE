import asyncHandler from "express-async-handler"
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import Tour, { ITourRequest } from "../models/tour";
import { NextFunction, Request, Response } from "express";
import Tourist, { ITouristRequest } from "../models/tourist";

interface DecodedToken extends JwtPayload {
    id: string;
}
const isAuthenticated = asyncHandler(async(req:ITouristRequest, res:Response, next:NextFunction) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken
    req.user = await Tourist.findById(decoded.id);

    next();
});

const isTourGuard = asyncHandler(async(req: ITourRequest,res : Response,next: NextFunction) => {
    const {tourGuard_token} = req.cookies;
    if(!tourGuard_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(tourGuard_token, process.env.JWT_SECRET_KEY as string) as DecodedToken;

    req.tourGuard = await Tour.findById(decoded.id);

    next();
});


const isAdmin = (...roles:string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} can not access this resource!`, 500))
        };
        next();
    }
}

export default {
    isAuthenticated,
    isAdmin,
    isTourGuard
}