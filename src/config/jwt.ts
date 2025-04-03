import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường nếu có

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "default-secret-key-for-dev", // Nên dùng biến môi trường cho production
  expiresIn: (process.env.JWT_EXPIRES_IN || 3600) as number,
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret-key-for-dev",
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
    60 * 60 * 24 * 7) as number,
  cookieExpiresIn: 7 * 24 * 60 * 60 * 1000, // 7 ngày (tính bằng mili giây cho cookie)
};
