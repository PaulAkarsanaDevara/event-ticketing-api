import { inject, injectable } from "tsyringe";
import { EventService } from "../events/event.service";
import { Booking } from "../../schemas/booking.schema";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import jwt from 'jsonwebtoken';

@injectable()
export class BookingService {

  constructor(@inject('EventService') private readonly eventService: EventService ) {}

  async createBooking(userId: string, eventId: string) {
    const event = await this.eventService.getEventById(eventId);

    // Cek kuota
    const totalBooked = await Booking.countDocuments({ event: eventId, status: { $ne: "cancelled" }  });
    if(totalBooked >= event.quota) throw new Error("Quota full");
    
    // cek double booking
    const existing = await Booking.findOne({ user: userId, event: eventId, status: { $ne: "cancelled"  } });
    if(existing) throw new Error("You already booked this event");

    //generate tiket code
    const ticketCode = `TICKET-${uuidv4().split("-")[0]}`;

    const booking = await Booking.create({ user: userId, event: eventId, ticketCode  });

    booking.paymentUrl = `http://localhost:5000/order?id=${booking._id.toString()}&eventId=${eventId}`

    await booking.save();

    return booking;

  }

  async confirmPayment(orderId: string) {
    const booking = await Booking.findById(orderId);
    console.log({ booking });
    if (!booking) throw new Error("Booking not found");

    booking.status = "paid";

    // Buat JWT khusus check-in
    const checkInPayload = {
      bookingId: booking._id,
      userId: booking.user,
      eventId: booking.event._id,
      ticketCode: booking.ticketCode
    };

    const checkInToken = jwt.sign(
      checkInPayload,
      process.env.JWT_CHECKIN_JWT_SECRET as string,
      { expiresIn: "2d" } // token berlaku 2 hari sebelum event
    );

    booking.checkInToken = checkInToken;


    // Path untuk simpan QR code
    const qrDir = path.join(__dirname, "../../../public/qrcodes");
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const qrPath = path.join(qrDir, `${booking.ticketCode}.png`);
    // const qrData = `Event: ${booking.event.name} | Ticket: ${booking.ticketCode} | User: ${booking.user}`;
     // QR code berisi URL endpoint check-in + token
    const checkInUrl = `${process.env.BASE_URL}/api/checkin/verify?token=${checkInToken}`;
    
    await QRCode.toFile(qrPath, checkInUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000",
        light: "#FFF"
      }
    });

    
  // Simpan path QR ke DB
    booking.qrCodePath = `/qrcodes/${booking.ticketCode}.png`;

    await booking.save();

    return booking;
  }

  async myBookings(userId: string) {
    return await Booking.find({ user: userId }).populate("event");
  }
}