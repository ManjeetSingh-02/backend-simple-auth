import express from "express";
import { forgotPassword, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, verifyUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/profile", getUserDetails);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logoutUser);

export default router;
