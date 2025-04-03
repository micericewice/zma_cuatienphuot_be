import express from "express";
import { login, logout, refreshToken } from "../controllers/auth";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);

export default router;
