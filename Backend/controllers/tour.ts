import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Tour from "../models/tour";
import { ITour, ITourRequest } from "../interface/Tour";
import fs from 'fs';
import *as jwt from "jsonwebtoken";
import path from "path";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendMail";


// create Tour
const createTourGuard = asyncHandler(async(req: Request, res:Response, next:NextFunction) => {
    try {
        const { email } = req.body as ITour
        const tourGuardEmailEmail = await Tour.findOne({email});

        if(tourGuardEmailEmail) {
           if(req.file){
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json({message: "Error deleting file"});
                }
            });

            return next(new ErrorHandler("User already exists", 400))
           }
           
        }

        if (!req.file) {
            return next(new ErrorHandler('No file provided', 400));
          }
          
        const filename = req.file.filename;
        const fileUrl = path.join(filename)

        const tourGuard = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };
        
        const activationToken = createActivationToken(tourGuard);

        const activationUrl = `http://localhost:3000/${activationToken}`
        
        try {
            await sendMail({
                email: tourGuard.email,
                subject: "Activate your touring account",
                message: `Howdy ${tourGuard.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${tourGuard.email} to activate your account`,
            })
        } catch (error) {
            if(error instanceof Error){
                return next(new ErrorHandler(error.message, 500))
            }else{
                 return next(new ErrorHandler("Unexpected", error));
            }
        }
    } catch (error) {
        if(error instanceof Error){
            return next(new ErrorHandler(error.message, 400))
        }else{
            return next(new ErrorHandler("Unexpected", error));
        }
        
    }
    
}
    //   const {
    //     name,
    //     email,
    //     password,
    //     address,
    //     phoneNumber,
    //     zipCode
    //   } = req.body as ITour
         
    //   const tourGuardEmailEmail = (await Tour.findOne({email})) as ITour
    //   if(tourGuardEmailEmail){
    //     res.status(400);
    //     throw new Error('Tour Guide with Email Already Exist');
    //   }else {
    //     const tourGuard = (await Tour.create({
    //         name, email, password, address, phoneNumber, zipCode
    //     })) as ITour;
    //   }
)

// create activation token
const createActivationToken = (tourGuard : any) => {
    return jwt.sign(tourGuard, process.env.ACTIVATION_SECRET as string, {
      expiresIn: "5m",
    });
};

// Activate Guard
const activateGuard = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token } = req.body;
  
        const newTourGuard = jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET as string
        );
  
        if (!newTourGuard) {
          return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } =
          newTourGuard as ITour;
  
        let tourGuard = await Tour.findOne({ email });
  
        if (tourGuard) {
          return next(new ErrorHandler("User already exists", 400));
        }
  
        tourGuard = await Tour.create({
          name,
          email,
          avatar,
          password,
          zipCode,
          address,
          phoneNumber,
        });
  
        sendTourToken(tourGuard, 201, res);
      } catch (error) {
        return next(new ErrorHandler("Unexpected", 500));
    }
});


//Login Guard
const LoginGuard = asyncHandler(async(req:Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ITour;
  
        if (!email || !password) {
          return next(new ErrorHandler("Please provide the all fields!", 400));
        }
  
        const tourGuard = await Tour.findOne({ email }).select("+password");
  
        if (!tourGuard) {
          return next(new ErrorHandler("User doesn't exists!", 400));
        }
  
        const isPasswordValid = await tourGuard.comparePassword(password);
  
        if (!isPasswordValid) {
          return next(
            new ErrorHandler("Please provide the correct information", 400)
          );
        }
  
        sendTourToken(tourGuard, 201, res);
      } catch (error) {
        return next(new ErrorHandler("Unexpected", 500));
    }
})

//Load  Tour
const getTour = asyncHandler(async(req: ITourRequest, res: Response, next: NextFunction) => {
    try {
        const tourGuard = await Tour.findById(req.tourGuard._id);
  
        if (!tourGuard) {
          return next(new ErrorHandler("User doesn't exists", 400));
        }
  
        res.status(200).json({
          success: true,
          tourGuard,
        });
      } catch (error) {
        return next(new ErrorHandler("Unexpected", 500));
    }
}) 

//Log out from Shop 
const logoutGuard = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("seller_token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        });
        res.status(201).json({
          success: true,
          message: "Log out successful!",
        });
      } catch (error) {
        return next(new ErrorHandler("Unexpected", 500));
    }
})