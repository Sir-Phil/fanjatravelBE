"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourist_1 = require("../controllers/tourist");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.route("/create-user").post(multer_1.default.single("file"), tourist_1.uploadFiles);
router.route("/activation").post(tourist_1.activateUser);
router.route("/login-user").post(tourist_1.loginUser);
router.route("/get-user").get(tourist_1.getUser);
router.route("/logout").get(tourist_1.logOutUser);
router.route("/update-user-info").put(tourist_1.updateUserInfo);
router.route("update-avatar").put(tourist_1.updateAvatar);
router.route("/update-user-password").put(tourist_1.UpdateUserPassword);
router.route("/user-info/:id").get(tourist_1.getUserInfo);
router.route("/admin-all-user").get(tourist_1.adminGetUser);
router.route("/delete-user/:id").delete(tourist_1.deleteUser);
exports.default = router;
