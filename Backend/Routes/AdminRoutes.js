const express = require("express");
const router = express.Router();
const BookingController = require("../Controller/BookingController");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin"); // Middleware to check if the user is an admin

// Confirm a booking (admin only)
router.put("/bookings/:id/confirm", authenticate, isAdmin, BookingController.confirmBooking);

// Reject a booking (admin only)
router.put("/bookings/:id/reject", authenticate, isAdmin, BookingController.rejectBooking);

module.exports = router;