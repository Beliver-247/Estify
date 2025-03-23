const express = require("express");

const router = express.Router();

const Booking = require("../Model/BookingModel");

const BookingController = require("../Controller/BookingControlle");

router.get("/",BookingController.getAllBooking);
router.post("/",BookingController.addBookings);
router.get("/:id",BookingController.getById);
router.put("/:id",BookingController.updateBooking);
router.delete("/:id",BookingController.deleteBooking);

module.exports = router;