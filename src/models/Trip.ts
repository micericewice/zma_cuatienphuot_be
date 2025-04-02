import mongoose, { Document, Schema } from "mongoose";

export interface ITrip extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  note: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    note: { type: String, required: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrip>("Trip", TripSchema);
