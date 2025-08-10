import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: "pending" | "paid" | "cancelled";
  ticketCode: string;
  paymentUrl?: string;
  qrCodePath?: string;
  checkInToken?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    ticketCode: { type: String, required: true },
    paymentUrl: { type: String },
    qrCodePath: { type: String },
    checkInToken: { type: String }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
