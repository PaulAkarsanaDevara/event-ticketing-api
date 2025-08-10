import { Router } from "express";
import { container } from '../containers/container';
import { authMiddleware } from '../middleware/auth.middleware';
import { EventController } from "../modules/events/event.controller";

const router = Router();
const eventController = container.resolve(EventController);

router.get("/", (req, res) => eventController.getAll(req, res));
router.get("/:id", (req, res) => eventController.getDetails(req, res));

router.post("/", authMiddleware(["admin"]), (req, res) => eventController.create(req, res));
router.put("/:id", authMiddleware(["admin"]), (req, res) => eventController.update(req, res));
router.delete("/:id", authMiddleware(["admin"]), (req, res) => eventController.delete(req, res));

export default router;