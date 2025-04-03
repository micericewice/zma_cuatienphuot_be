import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import AuthRoutes from "./routes/auth";
import TripRoutes from "./routes/trip";
import { ERROR_MESSAGES, STATUS_CODES } from "./utils/constants";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use("/api/trip", TripRoutes);
app.use("/api/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Cua Tien Phuot");
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR || "Đã xảy ra lỗi!",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

// Xử lý sự kiện unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  console.error("Unhandled Promise Rejection:", error);
  process.exit(1);
});

export default app;
