import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";
import { jwtConfig } from "../config/jwt";

export interface ISession extends Document {
  userId: string;
  deviceId: string;
  refreshToken: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;

export const addSession = async (
  userId: string,
  deviceId: string,
  accessToken: string,
  refreshToken: string
) => {
  try {
    const session = await Session.findOneAndUpdate(
      {
        userId,
        deviceId,
      },
      {
        $setOnInsert: {
          refreshToken,
          accessToken,
          userId,
          deviceId,
        },
      },
      { upsert: true, new: true }
    );

    await session.save();
    console.log("Session đã được thêm thành công!");
    return session;
  } catch (error) {
    console.error("Lỗi khi thêm session:", error);
  }
};

export const generateAccessToken = (
  userId: string,
  zaloId: string,
  deviceId: string
) => {
  const payload = {
    _id: userId,
    zaloId,
    deviceId,
  };
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

export const generateRefreshToken = (userId: string) => {
  const payload = {
    _id: userId,
  }; // Chỉ cần ID user là đủ

  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

export const verifyAccessToken = (
  token: string,
  cb: (err: any, decoded: any) => void
) => {
  return jwt.verify(token, jwtConfig.secret, cb);
};

export const verifyRefreshToken = (
  token: string,
  cb: (err: any, decoded: any) => void
) => {
  return jwt.verify(token, jwtConfig.refreshSecret, cb);
};
