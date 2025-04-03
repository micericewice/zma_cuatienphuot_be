import express from "express";
import { createTrip, getTripById, getTrips } from "../controllers/trip";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/trips", protect, getTrips);
router.get("/:id", protect, getTripById);
router.post("/", protect, createTrip);

export default router;
