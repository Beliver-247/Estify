const Booking = require("../Model/BookingModel");

// Get all bookings for the logged-in user
const getAllBooking = async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the authenticated request

    let bookings;

    try {
        bookings = await Booking.find({ user: userId }); // Filter bookings by user ID
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings) {
        return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ bookings });
};

// Add a new booking for the logged-in user
const addBookings = async (req, res) => {
    const { firstName, lastName, email, phone, age, address, nic } = req.body;
    const userId = req.user.userId; // Get the user ID from the authenticated request

    let bookings;

    try {
        bookings = new Booking({ firstName, lastName, email, phone, age, address, nic, user: userId });
        await bookings.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings) {
        return res.status(400).json({ message: "Unable to add booking" });
    }
    return res.status(200).json({ bookings });
};

// Get a booking by ID for the logged-in user
const getById = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId; // Get the user ID from the authenticated request

    let bookings;

    try {
        bookings = await Booking.findOne({ _id: id, user: userId }); // Filter by booking ID and user ID
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ bookings });
};

// Update a booking for the logged-in user
const updateBooking = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId; // Get the user ID from the authenticated request
    const { firstName, lastName, email, phone, age, address, nic } = req.body;

    let bookings;

    try {
        bookings = await Booking.findOneAndUpdate(
            { _id: id, user: userId }, // Filter by booking ID and user ID
            {
                firstName,
                lastName,
                email,
                phone,
                age,
                address,
                nic,
            },
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings) {
        return res.status(404).json({ message: "Unable to update booking details" });
    }
    return res.status(200).json({ bookings });
};

// Delete a booking for the logged-in user
const deleteBooking = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId; // Get the user ID from the authenticated request

    let bookings;

    try {
        bookings = await Booking.findOneAndDelete({ _id: id, user: userId }); // Filter by booking ID and user ID
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings) {
        return res.status(404).json({ message: "Unable to delete booking details" });
    }
    return res.status(200).json({ bookings });
};

module.exports = {
    getAllBooking,
    addBookings,
    getById,
    updateBooking,
    deleteBooking,
};