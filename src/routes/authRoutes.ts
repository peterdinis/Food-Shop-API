import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { loginUser, logout, myProfile, refreshTokenFn, registerUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, myProfile);
router.post("/refresh", refreshTokenFn)
router.post("/logout", logout);

export default router;