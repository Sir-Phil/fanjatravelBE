import asyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import upload from "../utils/multer";
import fs from 'fs';
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import *as jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import sendToken from "../utils/jwtToken";
import User, { IUserRequest } from "../models/user";

// @Desc Create user
// @Route /api/users/create-user
// @Method POST

// const uploadFile = upload.single('file');
const uploadFiles = async(req : Request, res : Response, next :NextFunction) => {
    try {
        const {name, email, password } = req.body
        const userEmail = await User.findOne({email});

        if(userEmail) {
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

        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl
        };
        
        const activationToken = createActivationToken(user);

        const activationUrl = `http://localhost:3000/${activationToken}`
        
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your touring account",
                message: `Howdy ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account`,
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

//create activation token
const createActivationToken = (user: any) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET as string, {
        expiresIn: "5m",
    });
}

// @Desc activate user
// @Route /api/users/activation
// @Method POST

const activateUser = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
 try {
    
    const {activation_token } = req.body;

    const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
    ) as jwt.JwtPayload;

    if(!newUser){
        return next(new ErrorHandler("Invalid token", 400));
    }
    const {name, email, password, avatar } = newUser;

    let user = await User.findOne({email});

    if(user){
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
        name,
        email,
        avatar,
        password,
    });
    sendToken(user, 201, res)
 } catch (error) {  
    if(error instanceof Error) {
        return next(new ErrorHandler(error.message, 500))
    }else{
        return next(new ErrorHandler("Unexpected", error))
    }
 }
})

// @Desc Login user
// @Route /api/users/login-user
// @Method POST

const loginUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
 try {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Please provide all fields", 400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("User doesn't exists", 400))
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) {
        return next(
            new ErrorHandler("Please enter the correct information", 400)
        );
    }
    sendToken(user, 201, res);
 } catch (error) {
    if(error instanceof Error){
        return next(new ErrorHandler(error.message, 500))
    }else{
        return next(new ErrorHandler("Unexpected Error", 500))
    }
 }
})

// @Desc Load user
// @Route /api/users/get-user
// @Method GET

const getUser = asyncHandler(async(req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);

    if(!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
        success: true,
        user,
    });
    } catch (error) {
        if(error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        }else {
            return next(new ErrorHandler("Unexpected Error", 500));
        }
    }
})

// @Desc Log out user
// @Route /api/users/logout
// @Method GET

const logOutUser = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(201).json({
        success: true,
        message: "Log out successfully",
    });
  } catch (error) {
    if(error instanceof Error){
        return next(new ErrorHandler(error.message, 500));
    }else{
        return next(new ErrorHandler("Unexpected Error", 500));
    }
  }
});

// @Desc Update User info
// @Route /api/users/update-user-info
// @Method Put

const updateUserInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password, phoneNumber, name} = req.body;
    
        const user = await User.findOne({email}).select("+password");
    
        if(!user){
            return next(new ErrorHandler("User not found", 400));
        }
    
        const isPasswordValid = await user.comparePassword(password);
    
        if(!isPasswordValid){
            return next(
                new ErrorHandler("please provide the correct information", 400)
            );
        }
    
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
    
        await user.save();
    
        res.status(201).json({
            success: true,
            user,
        })
    } catch (error) {
        if(error instanceof Error){
            return next(new ErrorHandler(error.message, 500));
        }
    }
})

// @Desc Update User Avatar
// @Route /api/users/update-avatar
// @Method Put

const updateAvatar = asyncHandler (async(req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const existsUser = await User.findById(req.user.id);
    
        const existAvatarPath = `upload/${existsUser?.avatar}`;
    
        fs.unlinkSync(existAvatarPath);
    
        if(!req.file){
            return next(new ErrorHandler("No avatar file Provided", 400))
        }
    
        const fileUrl = path.join(req.file.filename);
    
        const user = await User.findByIdAndUpdate(req.user.id, {
            avatar: fileUrl,
        });
    } catch (error) {
        if(error instanceof Error){
            return next(new ErrorHandler(error.message, 500));
        }else{
            return next(new ErrorHandler("Unexpected  Error", 500))
        }
    }
})

// @Desc Update User password
// @Route /api/users/update-user-password
// @Method Put

const UpdateUserPassword = asyncHandler (async(req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user?.comparePassword(
            req.body.oldPassword
        );
    
        if(!isPasswordMatched){
            return next(new ErrorHandler("Old password is incorrect!", 400));
        }
    
        if(req.body.newPassword !== req.body.confirmPassword){
            return next(
                new ErrorHandler("Password doesn't match with each other!", 400)
            );
        }
        user!.password = req.body.newPassword;
    
        await user?.save();
    
        res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        });
    } catch (error) {
        if(error instanceof Error){
            return next(new ErrorHandler(error.message, 500));
        }else{
            return next(new ErrorHandler("Unexpected Error", 500));
        }
    }
});

// @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET

const getUserInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)

        res.status(201).json({
        success: true,
        user,
    });
    } catch (error) {
        if(error instanceof Error){
            return next(new ErrorHandler(error.message, 500));
        }else{
            return next(new ErrorHandler("Unexpected Error", 500));
        }
    }
})

// @Desc find all User for ---- Admin
// @Route /api/users/admin-all-users
// @Method GET

const adminGetUser = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    } catch (error) {
        if(error instanceof Error) {
            return next (new ErrorHandler(error.message, 500));
        }else{
            return next(new ErrorHandler("Unexpected Error", 500));
        }
    }
});

// @Desc delete User for ---- Admin
// @Route /api/users/delete-users/:id
// @Method DELETE

const deleteUser = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return next(
                new ErrorHandler("User is not available with this Id", 400)
            );
        }
    
        await User.findByIdAndDelete(req.params.id);
    
        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    } catch (error) {
        if(error instanceof Error){
            return next( new ErrorHandler("Unexpected Error", 500))
        }
    }
})

export {
    uploadFiles,
    // uploadFile,
    activateUser,
    loginUser,
    getUser,
    logOutUser,
    updateUserInfo,
    updateAvatar,
    UpdateUserPassword,
    deleteUser,
    getUserInfo,
    adminGetUser
}