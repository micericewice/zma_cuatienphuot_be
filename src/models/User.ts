import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  zaloId: string;
  avatar: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    zaloId: { type: String, required: false },
    avatar: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
