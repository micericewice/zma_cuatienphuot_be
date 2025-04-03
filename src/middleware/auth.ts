import { NextFunction, Request, Response } from "express";
import { IProtectRequest } from "../interfaces";
import User from "../models/User";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

const getUserInfoFromZalo = async (accessToken: string) => {
  let url = "https://graph.zalo.me/v2.0/me?fields=id,name,picture";

  let options = {
    method: "GET",
    headers: {
      access_token: accessToken,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

// Middleware bảo vệ route
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let token: string | undefined;

  // Kiểm tra header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Lấy token từ header
    token = req.headers.authorization.split(" ")[1];
  }

  // Kiểm tra token tồn tại
  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
    });
  }

  try {
    // Lấy thông tin user từ zalo
    const user = await getUserInfoFromZalo(token);

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // tìm thông tin user trong db
    const userInDb = await User.findOne({ zaloId: user?.id });
    if (!userInDb) {
      const newUser = await User.create({
        zaloId: user?.id,
        name: user?.name,
        avatar: user?.picture?.data?.url,
      });

      (req as IProtectRequest).user = newUser;
    } else {
      // Lưu thông tin user vào request
      (req as IProtectRequest).user = userInDb;
    }
    next();
  } catch (error) {
    console.error("Lỗi xác thực:", (error as Error).message);
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }
};
