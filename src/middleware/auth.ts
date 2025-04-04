import { NextFunction, Request, Response } from "express";
import { AccessTokenPayload } from "../interfaces";
import { verifyAccessToken } from "../models/Session";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

// Mở rộng kiểu Request của Express để có thể chứa thông tin user
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload; // Hoặc định nghĩa một Interface cụ thể cho user payload
    }
  }
}

// Middleware bảo vệ route
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ header

  // Kiểm tra token tồn tại
  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
    });
  }

  verifyAccessToken(token, (err: any, decoded: AccessTokenPayload) => {
    if (err) {
      console.error("Lỗi xác thực token:", err.message);
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    } // Forbidden

    // Token hợp lệ, lưu thông tin user từ payload vào request để các xử lý sau có thể dùng
    req.user = decoded;
    next(); // Cho phép request đi tiếp
  });
};
