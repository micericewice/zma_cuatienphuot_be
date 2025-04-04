import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt"; // Đường dẫn đến file config của bạn
import { RefreshTokenPayload } from "../interfaces";
import Session, {
  generateAccessToken,
  verifyRefreshToken,
} from "../models/Session";
import User from "../models/User";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

export const login = async (req: Request, res: Response): Promise<any> => {
  const { zaloId, name, accessToken } = req.body;
  const { deviceId } = req.headers;

  try {
    // Xác thực người dùng
    let user;
    user = await User.findOne({ zaloId });
    if (!user) {
      // tạo người dùng
      user = await User.create({
        zaloId,
        name: name ?? zaloId,
      });
    }

    // Tạo payload cho JWT (chứa thông tin cần thiết, không nhạy cảm)
    const payload = {
      _id: user.id,
      zaloId: user.zaloId,
    };

    //  Tạo token
    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    const refreshTokenPayload = { _id: user._id }; // Chỉ cần ID user là đủ
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );

    // Lưu Refresh Token vào DB cho user này
    const session = await Session.findOneAndUpdate(
      {
        userId: user._id,
        deviceId,
      },
      { $setOnInsert: { refreshToken, accessToken } },
      { upsert: true, new: true }
    );

    //  Gửi token về cho client
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        // Có thể gửi thêm thông tin người dùng nếu cần
        user: {
          name: user.name,
          zaloId: user.zaloId,
          _id: user._id,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { refreshToken } = req.body;
  const { deviceId } = req.headers;

  try {
    // Tìm session trong DB có refresh token khớp
    const foundSession = await Session.findOne({ refreshToken, deviceId });

    // Phát hiện dùng lại refresh token đã bị thu hồi (nếu có cơ chế thu hồi)
    // hoặc không tìm thấy user => token không hợp lệ
    if (!foundSession) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN }); // Forbidden
    }
    const foundUser = await User.findOne({ _id: foundSession.userId });
    if (!foundUser) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN }); // Forbidden
    }

    // Xác thực chữ ký và hạn của refresh token
    verifyRefreshToken(
      refreshToken,
      async (err: any, decoded: RefreshTokenPayload) => {
        if (err || foundSession?.userId !== decoded?._id) {
          // Nếu token không hợp lệ, có thể cân nhắc xoá token cũ khỏi DB của user đó
          foundSession.refreshToken = ""; // hoặc undefined
          foundSession.accessToken = ""; // hoặc undefined
          await foundSession.save();
          return res
            .status(STATUS_CODES.FORBIDDEN)
            .json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN });
        }

        // Refresh token hợp lệ => Tạo access token MỚI
        const newAccessToken = generateAccessToken(
          foundSession.userId,
          foundUser.zaloId,
          deviceId as string
        );

        // Gửi access token mới
        res.json({
          success: true,
          message: "Làm mới token thành công",
          data: { accessToken: newAccessToken },
        });
      }
    );
  } catch (error) {
    console.error("Lỗi làm mới token:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.user ?? {};
  const { deviceId } = req.headers;
  try {
    const foundSession = await Session.findOne({ userId: _id, deviceId });
    if (foundSession) {
      // Xóa refresh token khỏi DB
      foundSession.refreshToken = ""; // Hoặc gán '' tùy cách bạn xử lý
      foundSession.accessToken = ""; // Hoặc gán '' tùy cách bạn xử lý
      await foundSession.save();
    }
    res
      .status(STATUS_CODES.SUCCESS)
      .json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
