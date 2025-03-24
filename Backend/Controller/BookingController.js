import Booking from "../Model/BookingModel.js";
import Property from "../Model/PropertyModel.js";

export const getAllBooking = async (req, res) => {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { status } = req.query;

    let query = {};
    if (userRole !== "admin") {
        query.user = userId;
    }
    if (status) {
        query.status = status;
    }

    let bookings;
    try {
        bookings = await Booking.find(query).populate("property");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json({ bookings });
};

export const addBookings = async (req, res) => {
    const { propertyId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    // Check if property exists and is for rent
    const property = await Property.findOne({
        _id: propertyId,
        propertyType: "rent",
        status: "approved"
    });
    
    if (!property) {
        return res.status(404).json({ 
            message: "Property not found or not available for rent" 
        });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        property: propertyId,
        status: { $ne: "rejected" }, // Only consider non-rejected bookings
        $or: [
            { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        ],
    });

    if (overlappingBooking) {
        return res.status(400).json({ 
            message: "Property is not available during the requested dates" 
        });
    }

    // Create new booking with property's price
    let booking;
    try {
        booking = new Booking({
            user: userId,
            property: propertyId,
            price: property.price, // Take price from property
            startDate,
            endDate,
            status: "pending",
        });
        await booking.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(400).json({ message: "Unable to add booking" });
    }
    return res.status(201).json({ booking });
};

export const confirmBooking = async (req, res) => {
    const id = req.params.id;

    let booking;
    try {
        booking = await Booking.findByIdAndUpdate(
            id,
            { status: "confirmed" },
            { new: true }
        ).populate("property");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ booking });
};

export const rejectBooking = async (req, res) => {
    const id = req.params.id;

    let booking;
    try {
        booking = await Booking.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        ).populate("property");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ booking });
};

export const getById = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    let booking;
    try {
        booking = await Booking.findOne({ _id: id, user: userId })
            .populate("property")
            .populate("user");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ booking });
};

export const updateBooking = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;
    const { firstName, lastName, email, phone, age, address, nic } = req.body;

    let booking;
    try {
        booking = await Booking.findOneAndUpdate(
            { _id: id, user: userId },
            { firstName, lastName, email, phone, age, address, nic },
            { new: true }
        ).populate("property");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(404).json({ message: "Unable to update booking details" });
    }
    return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    let booking;
    try {
        booking = await Booking.findOneAndDelete({ _id: id, user: userId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!booking) {
        return res.status(404).json({ message: "Unable to delete booking details" });
    }
    return res.status(200).json({ booking });
};