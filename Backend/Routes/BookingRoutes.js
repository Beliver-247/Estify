const express = require("express");
const router = express.Router();
const BookingController = require("../Controller/BookingController");
const authenticate = require("../middleware/authenticate"); // Import the authentication middleware

// Protect all routes with the authenticate middleware
router.get("/", authenticate, BookingController.getAllBooking);
router.post("/", authenticate, BookingController.addBookings);
router.get("/:id", authenticate, BookingController.getById);
router.put("/:id", authenticate, BookingController.updateBooking);
router.delete("/:id", authenticate, BookingController.deleteBooking);

module.exports = router;