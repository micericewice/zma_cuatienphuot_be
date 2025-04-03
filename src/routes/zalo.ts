import express from "express";
import { getUserInfoFromZalo } from "../controllers/zalo";

const router = express.Router();

router.get("/", getUserInfoFromZalo);

export default router;
