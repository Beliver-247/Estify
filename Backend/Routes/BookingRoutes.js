// Routes/BookingRoutes.js
import express from "express";
import * as BookingController from "../Controller/BookingController.js"; // Adjusted path with .js extension
import authenticate from "../middleware/authenticate.js"; // Adjusted path with .js extension

const router = express.Router();

// Protect all routes with the authenticate middleware
router.get("/", authenticate, BookingController.getAllBooking);
router.post("/", authenticate, BookingController.addBookings);
router.get("/:id", authenticate, BookingController.getById);
router.put("/:id", authenticate, BookingController.updateBooking);
router.delete("/:id", authenticate, BookingController.deleteBooking);

export default router;