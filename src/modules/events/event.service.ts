import { injectable } from "tsyringe";
import { Event } from "../../schemas/event.schema";
import { IEvent } from "../../interfaces/event.interface";

@injectable()
export class  EventService {

  async createEvent(data: Omit<IEvent, '_id'>) {
    return await Event.create(data);
  }

  async getEvents() {
    return await Event.find();
  }

  async getEventById(id: string) {
    const event =  await Event.findById(id);
    if(!event) throw new Error('Event not found!');
    return event;
  }

  async updateEvent(id: string, data: Partial<IEvent>) {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if(!event) throw new Error('Event not found!');
    return event;
  }

  async deleteEvent(id: string) {
    const event = await Event.findByIdAndDelete(id);
    if(!event) throw new Error('Event not found!');
    return { message: "Event deleted" };
  }

}