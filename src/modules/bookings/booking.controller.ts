import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { BookingService } from "./booking.service";

@injectable()
export class BookingController {
  constructor(@inject("BookingService") private readonly bookingService: BookingService) {}

  async create(req: Request, res: Response) {
    try {
      const booking = await this.bookingService.createBooking(req.body.userId, req.body.eventId);
      res.status(201).json({ message: "Booking created", data: booking });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
  }

  async confirm(req: Request, res: Response) {
    try {
      const booking = await this.bookingService.confirmPayment(req.params.orderId);
      res.json({ message: "Payment confirmed", data: booking });
    } catch (err: any) {
         res.status(400).json({ error: err.message });
    }
  }

  async listMyBookings(req: Request, res: Response) {
    try {
      const bookings = await this.bookingService.myBookings(req.body.userId);
      res.json({ data: bookings });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}