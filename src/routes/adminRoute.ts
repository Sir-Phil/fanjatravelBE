// import express, { NextFunction, Response } from "express";
// import { inviteGuard } from "../controllers/user";
// import { isAdmin, isAuthenticated } from "../middleware/auth";
// import { IUserRequest } from "../interface/user";

// const router = express.Router();

// const isAdminRoute =  (req : IUserRequest, res: Response, next: NextFunction) => {
//     // Check if the logged-in user is an admin
//     if (req.user && req.user.isAdmin) {
//       // User is an admin, proceed to the next middleware
//       next();
//     } else {
//       // User is not an admin, return an error response
//       res.status(403).json({ message: "Access denied. Only admins can access this route." });
//     }
//   };
  

// router.route("/invite-guard").post(isAdminRoute, isAuthenticated, isAdmin, inviteGuard);

// export default router;
