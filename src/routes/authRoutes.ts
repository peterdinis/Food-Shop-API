import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { allRegisterUsers, loginUser, logout, myProfile, refreshTokenFn, registerUser, userInfo } from "../controllers/authController";

const router = express.Router();

router.get("/users", allRegisterUsers);
router.get("/user/:email", verifyToken, userInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, myProfile);
router.post("/refresh", refreshTokenFn)
router.post("/logout", logout);

export default router;