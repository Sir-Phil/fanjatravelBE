// import mongoose from "mongoose";
// import bcrypt from "bcryptjs" ;
// import jwt from "jsonwebtoken"
// import { ITour } from "../interface/tour";


// const TourSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please enter your Tour name!"],
//       },
//       email: {
//         type: String,
//         required: [true, "Please enter your Tout email address"],
//       },
//       password: {
//         type: String,
//         required: [true, "Please enter your password"],
//         minLength: [6, "Password should be greater than 6 characters"],
//         select: false,
//       },
//       address: {
//         type: String,
//         required: true,
//       },
//       phoneNumber: {
//         type: Number,
//         required: true,
//       },
//       avatar: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: Number,
//         required: true,
//       },
//       isTourGuard: {
//         type: Boolean,
//         default: false,
//       },

//       resetPasswordToken: String,
//       resetPasswordTime: Date,

// },{
//     timestamps: true
// })

// // Hash password
// TourSchema.pre<ITour>("save", async function (next) {
//     // const user = this as ITour
//     if(!this.isModified("password")) {
//       next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
    
//   });
  
//   // jwt token
//   TourSchema.methods.getJwtToken = function () {
//     const user = this as ITour
//     return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, {
//       expiresIn: process.env.JWT_EXPIRES,
//     });
//   };
  
//   // comapre password
//   TourSchema.methods.comparePassword = async function (enteredPassword: string) {
//     return await bcrypt.compare(enteredPassword, this.password);
//   };
  

// const Tour = mongoose.model<ITour>("Tour", TourSchema)

// export default Tour;