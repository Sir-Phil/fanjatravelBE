import asyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import upload from "../utils/multer";
import fs from 'fs';
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import *as jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import sendToken from "../utils/jwtToken";
import User from "../models/user";
import { IUser, IUserRequest } from "../interface/user";
import { isAdmin } from "../middleware/auth";



// POST /api/users/invitations/tour-guard
const inviteGuard = asyncHandler  (async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body;

      const adminUser = req.user; // Assuming you have implemented authentication middleware to extract the logged-in user
        if (!adminUser || !adminUser.isAdmin) {
        return next(new ErrorHandler("Only admins can send tour guide invitations", 403));
    }
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("Email is already registered", 400));
      }
  
      // Create a new user with the provided name, email, and role
      const user: IUser = new User({
        email,
      });
  
      await user.save();

      //Email sending function
      await sendMail({
            email: user.email,
            subject: "Invitation to join as a Tour Guide",
            message: `<p>Hello,</p>
                        <p>You have been invited to join as a Tour Guide. Please click on the following link to complete your registration:</p>
                        <p><a href="${process.env.SITE_URL}/tour-guide-registration/${user._id}">Click here to activate your account</a></p>
                        <p>Best regards,</p>
                        <p>The Admin Team</p>`,
      });
  
      res.status(201).json({
            success: true,
            message: `please check your email:- ${user.email} to continue account registration`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
});
  
  // @Desc activate Guard
  // @Route /api/users/activation
  // @Method POST
  
  const activateTourGuard = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const {activation_token } = req.body;
  
    const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
    ) as jwt.JwtPayload;
  
    if(!newUser){
        return next(new ErrorHandler("Invalid token", 400));
    }
    const {name, surname, email, password, avatar, phoneNumber, address, age, gender, language } = newUser;
  
    let user = await User.findOne({email});
  
    if(user){
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
        name,
        surname,
        email,
        age,
        gender,
        language,
        avatar,
        password,
        phoneNumber,
        address,
        isTourGuard: true,
        
    });
    sendToken(user, 201, res)
  } catch (error:any) {  
        return next(new ErrorHandler(error.message, 500))
  }
  })
  
  // @Desc Login Guard
  // @Route /api/users/login-user
  // @Method POST
  
  const loginTourGuard = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
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
  } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
  }
  })

// @Desc Load Guard
// @Route /api/users/guard
// @Method GET

const getGuard = asyncHandler(async(req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);

    if(!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
        success: true,
        user,
    });
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
})

// @Desc Log out user
// @Route /api/users/logout
// @Method GET

const logOutGard = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
      });
      res.status(201).json({
          success: true,
          message: "Log out successfully",
      });
    } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
    }
  });


  // @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET
//@Access Admin

const getGuardInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)

        res.status(201).json({
        success: true,
        user,
    });
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
})
  
  // @Desc Update User info
// @Route /api/users/update-user-info
// @Method Put

const updateGuardInfo = asyncHandler(async(req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const {email, surname, phoneNumber, name, address, age, gender, language} = req.body;
    
        const user = await User.findOne(req.user._id);
    
        if(!user){
            return next(new ErrorHandler("User not found", 400));
        }
    
        user.name = name;
        user.surname = surname,
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.address = address;
        user.age = age;
        user.gender = gender;
        user.language = language;

        await user.save();
    
        res.status(201).json({
            success: true,
            user,
        })
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
});

// @Desc Update User Avatar
// @Route /api/users/update-avatar
// @Method Put

const updateGuardAvatar = asyncHandler (async(req: IUserRequest, res: Response, next: NextFunction) => {
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

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
})

// @Desc find all User for ---- 
// @Route /api/users/admin-all-tour-guard
// @Method GET
//@Access Admin

const adminGetTourGuard = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    } catch (error: any) {
            return next (new ErrorHandler(error.message, 500));
    }
});

// @Desc delete User for ---- 
// @Route /api/users/delete-tour-guard/:id
// @Method DELETE
//@access Admin
const adminDeleteTourGuard = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
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
    } catch (error: any) {
            return next( new ErrorHandler(error.message, 500))
    }
})




//########################################TOUR GUARDS ENDS HERE##########################################################


//########################################USER AREAS STARTS HERE ########################################################

// const uploadFile = upload.single('file');
const uploadFiles = async(req : Request, res : Response, next :NextFunction) => {
    try {
        const {name, email, password, address, phoneNumber, surname } = req.body

        
        const userEmail = await User.findOne({email});

        if(userEmail) {
        //    if(req.file){
        //     const filename = req.file.filename;
        //     const filePath = `uploads/${filename}`;
        //     fs.unlink(filePath, (err) => {
        //         if(err){
        //             console.log(err);
        //             res.status(500).json({message: "Error deleting file"});
        //         }
        //     });

        //     return next(new ErrorHandler("User already exists", 400))
        //    }
           
        }

        // if (!req.file) {
        //     return next(new ErrorHandler('No file provided', 400));
        //   }
          
        // const filename = req.file.filename;
        // const fileUrl = path.join(filename)

        const user = {
            name: name,
            surname: surname,
            email: email,
            password: password,
            // avatar: fileUrl,
            address: address,
            phoneNumber: phoneNumber
        };
        
        const activationToken = createActivationToken(user);

        const activationUrl = `${process.env.SITE_URL}/activation${activationToken}`
        
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your Tour Account",
                message: `<p>Howdy ${user.name}, please click on the link to activate your account: <a href="${activationUrl}">Activate here</a></p>`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account`,
            })
        } catch (error: any) {
                return next(new ErrorHandler(error.message, 500))
        }
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
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
    const {name, surname, language, age, gender, email, password, avatar, address, phoneNumber } = newUser;

    let user = await User.findOne({email});

    if(user){
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
        name,
        surname,
        email,
        avatar,
        password,
        address,
        phoneNumber,
        language,
        age,
        gender,
    });
    sendToken(user, 201, res)
 } catch (error:any) {  
        return next(new ErrorHandler(error.message, 500))
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
 } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
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
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
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
  } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
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
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
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
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
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
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
});

// @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET
//@Access Admin

const getUserInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id)

        res.status(201).json({
        success: true,
        user,
    });
    } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
    }
})

// @Desc find all User for ---- 
// @Route /api/users/admin-all-users
// @Method GET
//@Access Admin

const adminGetUser = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    } catch (error: any) {
            return next (new ErrorHandler(error.message, 500));
    }
});

// @Desc delete User for ---- 
// @Route /api/users/delete-users/:id
// @Method DELETE
//@access Admin
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
    } catch (error: any) {
            return next( new ErrorHandler(error.message, 500))
    }
})


const grantAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    try {
      const user: IUser | null = await User.findById(id);
  
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      user.isAdmin = true;
      await user.save();
  
      res.status(200).json({ success: true, message: "User granted admin privileges" });
    } catch (error) {
      return next(new ErrorHandler("Internal server error", 500));
    }
  });
  

export {
    inviteGuard,
    // uploadGuardFiles,
    activateTourGuard,
    loginTourGuard,
    getGuard,
    getGuardInfo,
    uploadFiles,
    logOutGard,
    updateGuardAvatar,
    updateGuardInfo,
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
    adminGetUser,
    adminGetTourGuard,
    adminDeleteTourGuard,
    grantAdmin
}