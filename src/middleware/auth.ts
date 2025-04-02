import { NextFunction, Request, Response } from "express";
import { IProtectRequest } from "../interfaces";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

// Middleware bảo vệ route
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let idToken: string | undefined;

  // Kiểm tra header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Lấy token từ header
    idToken = req.headers.authorization.split(" ")[1];
  }

  // Kiểm tra token tồn tại
  if (!idToken) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
    });
  }

  try {
    // Verify token với zalo
    // const decodedToken = await admin
    //   .auth()
    //   .verifyIdToken(idToken as string);

    // Lấy thông tin user từ zalo
    // const user = //fetch zalo api

    // if (!user) {
    //   return res.status(STATUS_CODES.NOT_FOUND).json({
    //     success: false,
    //     message: ERROR_MESSAGES.USER_NOT_FOUND,
    //   });
    // }

    // Lưu thông tin user vào request
    (req as IProtectRequest).user = {
      userId: "67ed34e67682cb23632d7d63",
      zaloId: "1234567890",
    };
    next();
  } catch (error) {
    console.error("Lỗi xác thực:", (error as Error).message);
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }
};
