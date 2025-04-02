import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  note: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    zaloId: { type: String, required: false },
    displayName: { type: String, required: false },
    avatar: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
