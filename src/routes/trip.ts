import express from "express";
import { createTrip, getTripById, getTrips } from "../controllers/trip";
import { protect } from "../middleware/auth";

const trip = express.Router();

trip.get("/trips", protect, getTrips);
trip.get("/:id", protect, getTripById);
trip.post("/", protect, createTrip);

export default trip;
