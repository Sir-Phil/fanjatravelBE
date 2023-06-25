import express from  "express";
import { UpdateUserPassword, activateUser, adminGetUser, deleteUser, getUser, getUserInfo, logOutUser, loginUser, updateAvatar, updateUserInfo, uploadFiles } from "../controllers/user";
import upload from "../utils/multer";


const router = express.Router();

router.route("/create-user").post(upload.single("file"), uploadFiles);
router.route("/activation").post(activateUser);
router.route("/login-user").post(loginUser);
router.route("/get-user").get(getUser);
router.route("/logout").get(logOutUser);
router.route("/update-user-info").put(updateUserInfo);
router.route("update-avatar").put(updateAvatar);
router.route("/update-user-password").put(UpdateUserPassword);
router.route("/user-info/:id").get(getUserInfo);
router.route("/admin-all-user").get(adminGetUser);
router.route("/delete-user/:id").delete(deleteUser);

export default router;