import { Router } from "express";
import { container } from '../containers/container';
import { authMiddleware } from '../middleware/auth.middleware';
import { BookingController } from "../modules/bookings/booking.controller";

const router = Router();
const bookingController = container.resolve(BookingController);

router.post("/", authMiddleware(["user", "admin"]), (req, res) => bookingController.create(req, res));
router.get("/my", authMiddleware(["user", "admin"]), (req, res) => bookingController.listMyBookings(req, res));
router.post("/confirm/:orderId", (req, res) => bookingController.confirm(req, res));

export default router;