import express from "express";
import { getTrips } from "../controllers/trip";

const trip = express.Router();

trip.get("/trips", getTrips);

export default trip;
