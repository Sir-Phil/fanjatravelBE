import asyncHandler from "express-async-handler"
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Response } from "express";
import User from "../models/user";
import { IUserRequest } from "../interface/user";


export const isAuthenticated = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
  let token;

  // // Skip authentication check for registration completion route
  // if (req.originalUrl === '/tour-guide-registration/:id') {
  //   next();
  //   return;
  // }

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      req.user = await User.findById(decoded.id).select("-password");
      
      console.log("User data:", req.user);

      next();
    } catch (error: any) {
      console.log(error.message);
      res.status(401);
      throw new Error("Invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No token provided");
  }
});

export const isAdmin = (req: IUserRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("User is not an admin");
  }
};

export const isTourGuard = (req: IUserRequest, res: Response, next: NextFunction) => {
  console.log('req.user:', req.user);
  if (req.user && req.user.isTourGuard) {
    console.log('User is a tour guard');
    next();
  } else {
    console.log('User is not a tour guard');
    res.status(403);
    throw new Error("User is not a tour guard");
  }
};




// import asyncHandler from "express-async-handler"

// import jwt, { JwtPayload } from "jsonwebtoken";
// import ErrorHandler from "../utils/ErrorHandler";
// import { NextFunction, Response } from "express";
// import User from "../models/user";
// import { IUserRequest } from "../interface/user";


// interface DecodedToken extends JwtPayload {
//     id: string;
// }
// const isAuthenticated = asyncHandler(async(req:IUserRequest, res:Response, next:NextFunction) => {
//     const {token} = req.cookies;

//     if(!token){
//         return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken
//     req.user = await User.findById(decoded.id);

//     next();
// });

// const isTourGuard = asyncHandler(async(req: IUserRequest,res : Response,next: NextFunction) => {
//     const {tourGuard_token} = req.cookies;
//     if(!tourGuard_token){
//         return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(tourGuard_token, process.env.JWT_SECRET_KEY as string) as DecodedToken;

//     req.user = await User.findById(decoded.id);

//     next();
// });


// const isAdmin = (...roles:string[]) => {
//     return (req: any, res: Response, next: NextFunction) => {
//         if(!roles.includes(req.user.role)) {
//             return next(new ErrorHandler(`${req.user.role} can not access this resource!`, 500))
//         };
//         next();
//     }
// }

// export default {
//     isAuthenticated,
//     isAdmin,
//     isTourGuard
// }
//


// 

// authMiddleware.ts

// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import User from "../models/user";
// import ErrorHandler from "../utils/ErrorHandler";
// import { IUserRequest } from "../interface/user";

// interface DecodedToken extends JwtPayload {
//   id: string;
//   isAdmin?: boolean;
//   isTourGuide?: boolean;
// }

// const isAuthenticated = async (
//   req: IUserRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY as string
//     ) as DecodedToken;

//     const { id } = decoded; // Extract the id from the decoded object

//     req.user = await User.findById(id);

//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid token", 401));
//   }
// };

// const isAdmin = async (req: IUserRequest, res: Response, next: NextFunction) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY as string
//     ) as DecodedToken;

//     const { id, isAdmin } = decoded; // Extract the id and isAdmin from the decoded object

//     req.user = await User.findById(id);

//     if (!isAdmin) {
//       return next(new ErrorHandler("User is not an admin", 403));
//     }

//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid token", 401));
//   }
// };

// const isTourGuard = async (
//   req: IUserRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY as string
//     ) as DecodedToken;

//     const { id, isTourGuide } = decoded; // Extract the id and isTourGuide from the decoded object

//     req.user = await User.findById(id);

//     if (!isTourGuide) {
//       return next(new ErrorHandler("User is not a tour guide", 403));
//     }

//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid token", 401));
//   }
// };




// const isAdmin = async (req: IUserRequest, res: Response, next: NextFunction) => {
//   try {
//     const { admin_token } = req.cookies;

//     if (!admin_token) {
//       return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(
//       admin_token,
//       process.env.JWT_SECRET_KEY as string
//     ) as DecodedToken;

//     req.user = await User.findById(decoded.id);

//     if (!decoded.isAdmin) {
//       return next(new ErrorHandler("User is not an admin", 403));
//     }

//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid token", 401));
//   }
// };

// export { isAuthenticated, isTourGuard, isAdmin };
