import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { IUser } from "../interface/user";
import { LanguageOptions } from "../interface/languageOption";
import { Gender } from "../interface/genderOption";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Please enter your name!"]
    },
    surname: {
        type: String,
        // required: [true, "Please enter your name!"]
    },
    age: {
        type: String,
        // required: [true, "Please enter your name!"]
    },
    gender: {
        type: String,
        enum: Object.values(Gender)
    },
    language: { 
        type: [{ type: String, enum: LanguageOptions }],
         required: true },

    languages: {
        type: [String],
        // required: [true, "Please enter your name!"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"]
    },

    password: {
        type: String,
        // required: [true, "Please enter your password"],
        // minLength: [4, "Password Should be more 4 characters"],
        // select: false
    },

    phoneNumber: {
        type: Number
    },

    isAdmin: {
        type: Boolean,
        default: false,
      },
    isTourGuard: {
        type: Boolean,
        default: false,
    },

    avatar: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        
      },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt:{
        type: Date,
        default: Date.now(),
      },

    resetPasswordToken: String,
    resetPasswordTime: Date,
});

//Hash password
userSchema.pre<IUser>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        next();
    } catch (error : any) {
        next(error);
    }
})

//jwt token
userSchema.methods.getJwtToken = function() {
    const user = this as IUser
    return jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword: string){
    const user = this as IUser
    return await bcrypt.compareSync(enteredPassword, user.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;