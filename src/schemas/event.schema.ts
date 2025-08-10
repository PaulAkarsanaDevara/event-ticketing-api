import { model, Schema } from "mongoose";
import { IEvent } from "../interfaces/event.interface";

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  quota: { type: Number, required: true },
  booked: { type: Number, default: 0 },
})

export const Event = model<IEvent>('Event', EventSchema);