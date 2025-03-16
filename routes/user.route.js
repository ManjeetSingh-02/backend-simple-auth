import express from "express";
import { forgotPassword, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, verifyUser } from "../controllers/user.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/profile", isLoggedIn, getUserDetails);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", isLoggedIn, logoutUser);

export default router;
