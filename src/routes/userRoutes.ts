import express from "express";
import {
  UpdateUserPassword,
  // activateTourGuard,
  activateUser,
  adminDeleteTourGuard,
  adminGetTourGuard,
  adminGetUser,
  adminVerifyTourGuards,
  deleteUser,
  getGuard,
  getGuardInfo,
  getUser,
  getUserInfo,
  grantAdmin,
  inviteGuard,
  logOutGard,
  logOutUser,
  loginUser,
  tourGuardAccountContinue,
  updateAvatar,
  updateGuardAvatar,
  updateGuardInfo,
  updateUserInfo,
  uploadFiles,
  // uploadGuardFiles,
} from "../controllers/user";
import upload from "../utils/multer";
import {
  isAdmin,
  isAuthenticated,
  isTourGuard,
} from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/create-user", upload.single("file"), uploadFiles);
router.post("/activation", activateUser);
router.post("/login-user", loginUser);

// Routes accessible only to authenticated users
router.get("/get-user", getUser);
router.get("/user/:id", getUserInfo);
router.put("/update-user-info", updateUserInfo);
router.put("/update-avatar", upload.single("image"), updateAvatar);
router.put("/update-user-password", UpdateUserPassword);
router.get("/logout", logOutUser);

// Routes accessible only to admin
router.get("/admin-all-user", isAuthenticated, isAdmin, adminGetUser);
router.delete("/delete-user/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/admin-all-tour-guard", isAuthenticated, isAdmin, adminGetTourGuard);
router.delete("/delete-tour-guard/:id", isAuthenticated, isAdmin, adminDeleteTourGuard);

// Routes accessible only to tour guards
// router.post("/create-guard", upload.single("file"), uploadGuardFiles);
// router.post("/activate-guard", activateTourGuard);
router.get("/get-guard", isAuthenticated, isTourGuard, getGuard);
router.get("/get-tour-guard/:id", isAuthenticated, isTourGuard, getGuardInfo);
router.put("/update-guard-avatar", isTourGuard, upload.single("image"), updateGuardAvatar);
router.put("/update-guard-info/:id", isAuthenticated, isTourGuard, updateGuardInfo);
router.put("/tour-guide-registration/:id",  tourGuardAccountContinue);

router.get("/logout-guard", logOutGard);

// Routes to grant a user Admin
router.post("/users/:id/grantAdmin", grantAdmin);

// Routes accessible only to admin (including tour guards)

router.post("/invite-guard", isAuthenticated, isAdmin, inviteGuard);
router.put("/verify-tour-guard", isAuthenticated, isAdmin, adminVerifyTourGuards);

export default router;
