"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetUser = exports.getUserInfo = exports.deleteUser = exports.UpdateUserPassword = exports.updateAvatar = exports.updateUserInfo = exports.logOutUser = exports.getUser = exports.loginUser = exports.activateUser = exports.uploadFiles = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fs_1 = __importDefault(require("fs"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const path_1 = __importDefault(require("path"));
const jwt = __importStar(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const tourist_1 = __importDefault(require("../models/tourist"));
// @Desc Create user
// @Route /api/users/create-user
// @Method POST
// const uploadFile = upload.single('file');
const uploadFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userEmail = yield tourist_1.default.findOne({ email });
        if (userEmail) {
            if (req.file) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
                return next(new ErrorHandler_1.default("User already exists", 400));
            }
        }
        if (!req.file) {
            return next(new ErrorHandler_1.default('No file provided', 400));
        }
        const filename = req.file.filename;
        const fileUrl = path_1.default.join(filename);
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl
        };
        const activationToken = createActivationToken(user);
        const activationUrl = `http://localhost:3000/${activationToken}`;
        try {
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: "Activate your touring account",
                message: `Howdy ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account`,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
            else {
                return next(new ErrorHandler_1.default("Unexpected", error));
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected", error));
        }
    }
});
exports.uploadFiles = uploadFiles;
//create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};
// @Desc activate user
// @Route /api/users/activation
// @Method POST
const activateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token } = req.body;
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (!newUser) {
            return next(new ErrorHandler_1.default("Invalid token", 400));
        }
        const { name, email, password, avatar } = newUser;
        let user = yield tourist_1.default.findOne({ email });
        if (user) {
            return next(new ErrorHandler_1.default("User already exists", 400));
        }
        user = yield tourist_1.default.create({
            name,
            email,
            avatar,
            password,
        });
        (0, jwtToken_1.default)(user, 201, res);
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected", error));
        }
    }
}));
exports.activateUser = activateUser;
// @Desc Login user
// @Route /api/users/login-user
// @Method POST
const loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please provide all fields", 400));
        }
        const user = yield tourist_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User doesn't exists", 400));
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default("Please enter the correct information", 400));
        }
        (0, jwtToken_1.default)(user, 201, res);
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.loginUser = loginUser;
// @Desc Load user
// @Route /api/users/get-user
// @Method GET
const getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield tourist_1.default.findById(req.user.id);
        if (!user) {
            return next(new ErrorHandler_1.default("User doesn't exist", 400));
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.getUser = getUser;
// @Desc Log out user
// @Route /api/users/logout
// @Method GET
const logOutUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(201).json({
            success: true,
            message: "Log out successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.logOutUser = logOutUser;
// @Desc Update User info
// @Route /api/users/update-user-info
// @Method Put
const updateUserInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phoneNumber, name } = req.body;
        const user = yield tourist_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default("please provide the correct information", 400));
        }
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        yield user.save();
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
    }
}));
exports.updateUserInfo = updateUserInfo;
// @Desc Update User Avatar
// @Route /api/users/update-avatar
// @Method Put
const updateAvatar = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existsUser = yield tourist_1.default.findById(req.user.id);
        const existAvatarPath = `upload/${existsUser === null || existsUser === void 0 ? void 0 : existsUser.avatar}`;
        fs_1.default.unlinkSync(existAvatarPath);
        if (!req.file) {
            return next(new ErrorHandler_1.default("No avatar file Provided", 400));
        }
        const fileUrl = path_1.default.join(req.file.filename);
        const user = yield tourist_1.default.findByIdAndUpdate(req.user.id, {
            avatar: fileUrl,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected  Error", 500));
        }
    }
}));
exports.updateAvatar = updateAvatar;
// @Desc Update User password
// @Route /api/users/update-user-password
// @Method Put
const UpdateUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield tourist_1.default.findById(req.user.id).select("+password");
        const isPasswordMatched = yield (user === null || user === void 0 ? void 0 : user.comparePassword(req.body.oldPassword));
        if (!isPasswordMatched) {
            return next(new ErrorHandler_1.default("Old password is incorrect!", 400));
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler_1.default("Password doesn't match with each other!", 400));
        }
        user.password = req.body.newPassword;
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.UpdateUserPassword = UpdateUserPassword;
// @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET
const getUserInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield tourist_1.default.findById(req.params.id);
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.getUserInfo = getUserInfo;
// @Desc find all User for ---- Admin
// @Route /api/users/admin-all-users
// @Method GET
const adminGetUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield tourist_1.default.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        else {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.adminGetUser = adminGetUser;
// @Desc delete User for ---- Admin
// @Route /api/users/delete-users/:id
// @Method DELETE
const deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield tourist_1.default.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler_1.default("User is not available with this Id", 400));
        }
        yield tourist_1.default.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler_1.default("Unexpected Error", 500));
        }
    }
}));
exports.deleteUser = deleteUser;
