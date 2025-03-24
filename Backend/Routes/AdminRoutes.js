// Routes/AdminBookingRoutes.js
import express from "express";
import * as BookingController from "../Controller/BookingController.js"; // Adjusted path with .js extension
import authenticate from "../middleware/authenticate.js"; // Adjusted path with .js extension
import isAdmin from "../middleware/isAdmin.js"; // Adjusted path with .js extension

const router = express.Router();

// Confirm a booking (admin only)
router.put("/bookings/:id/confirm", authenticate, isAdmin, BookingController.confirmBooking);

// Reject a booking (admin only)
router.put("/bookings/:id/reject", authenticate, isAdmin, BookingController.rejectBooking);

export default router;