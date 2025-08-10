/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import { Request, Response } from "express";

@injectable()
export class EventController {
  constructor(@inject('EventService') private readonly eventService: EventService ) {}

  async create(req: Request, res: Response) {
    try {
      const results = await this.eventService.createEvent(req.body);
      res.status(201).json({ message: "Event created", data: results });
    } catch (err: any) {
       res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const results = await this.eventService.getEvents();
      res.json({ data: results });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getDetails(req: Request, res: Response) {
    try {
      const result = await this.eventService.getEventById(req.params.id);
      res.json({ data: result});
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id: eventId } = req.params;
      const results = await this.eventService.updateEvent(eventId, req.body);
      res.json({ message: 'Event updated', data: results});
    } catch (err: any) {
       res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id: eventId } = req.params;
      const result = await this.eventService.deleteEvent(eventId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

}