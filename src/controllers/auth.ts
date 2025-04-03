import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt"; // Đường dẫn đến file config của bạn
import User from "../models/User";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

export const login = async (req: Request, res: Response): Promise<any> => {
  const { zaloId, name, deviceId } = req.body;

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
    user.refreshToken = refreshToken;
    await user.save(); // Lưu lại user với refresh token mới

    //  Gửi token về cho client
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        refreshToken,
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

  try {
    // Tìm user trong DB có refresh token khớp
    const foundUser = await User.findOne({ refreshToken });

    // Phát hiện dùng lại refresh token đã bị thu hồi (nếu có cơ chế thu hồi)
    // hoặc không tìm thấy user => token không hợp lệ
    if (!foundUser) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN }); // Forbidden
    }

    // Xác thực chữ ký và hạn của refresh token
    jwt.verify(
      refreshToken,
      jwtConfig.refreshSecret,
      async (err: any, decoded: any) => {
        // Nếu token không hợp lệ hoặc user ID trong token không khớp với user tìm thấy
        if (err || foundUser._id?.toString() !== decoded._id) {
          // Nếu token không hợp lệ, có thể cân nhắc xoá token cũ khỏi DB của user đó
          foundUser.refreshToken = ""; // hoặc undefined
          await foundUser.save();
          return res
            .status(STATUS_CODES.FORBIDDEN)
            .json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN });
        }

        // Refresh token hợp lệ => Tạo access token MỚI
        const accessTokenPayload = {
          _id: foundUser._id,
          zaloId: foundUser.zaloId,
        };
        const newAccessToken = jwt.sign(accessTokenPayload, jwtConfig.secret, {
          expiresIn: jwtConfig.expiresIn,
        });

        // Gửi access token mới
        res.json({
          success: false,
          message: ERROR_MESSAGES.INVALID_TOKEN,
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
  const { userId } = req.user;
  try {
    const foundUser = await User.findById(userId);
    if (foundUser) {
      // Xóa refresh token khỏi DB
      foundUser.refreshToken = ""; // Hoặc gán '' tùy cách bạn xử lý
      await foundUser.save();
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
