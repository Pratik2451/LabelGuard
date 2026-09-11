import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);

// Private routes (login required) 
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;