import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import connectDB from "./config/db";
import { swaggerDocs, swaggerUi } from "./config/swagger";
import AuthRoutes from "./routes/auth";
import TripRoutes from "./routes/trip";
import ZaloRoutes from "./routes/zalo";
import { ERROR_MESSAGES, STATUS_CODES } from "./utils/constants";

const ROOT_FOLDER = path.join(__dirname, "..");
const SRC_FOLDER = path.join(ROOT_FOLDER, "src");
const __swaggerDistPath = path.join(
  ROOT_FOLDER,
  "node_modules",
  "swagger-ui-dist"
);

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

// Tích hợp Swagger UI
app.use(
  "/api/docs",
  express.static(__swaggerDistPath, { index: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);
// Mount routers
app.use("/api/trip", TripRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/zalo", ZaloRoutes);
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
  console.log(`Server is running on port ${PORT}`);
});

// Xử lý sự kiện unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  console.error("Unhandled Promise Rejection:", error);
  process.exit(1);
});

export default app;
