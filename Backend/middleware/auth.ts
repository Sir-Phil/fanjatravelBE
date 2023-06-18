import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/User";

const isAuthenticated = asyncHandler(async(req:any, res:any, next:any) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = await User.findById({decoded, 'token.token':token});

    next();
});


const isAdmin = (...roles:any) => {
    return (req: any, res: any, next: any) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} can not access this resource!`, 500))
        };
        next();
    }
}

export default {
    isAuthenticated,
    isAdmin
}