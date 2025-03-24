const Inquiry = require("../Model/InquiryModel");
const Booking = require("../Model/BookingModel");

// Submit an inquiry
const submitInquiry = async (req, res) => {
    const { bookingId, message } = req.body;
    const userId = req.user.userId; // Get the user ID from the authenticated request

    // Check if the booking belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
        return res.status(404).json({ message: "Booking not found or access denied" });
    }

    let inquiry;

    try {
        inquiry = new Inquiry({ booking: bookingId, user: userId, message });
        await inquiry.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!inquiry) {
        return res.status(400).json({ message: "Unable to submit inquiry" });
    }
    return res.status(201).json({ inquiry });
};

// Respond to an inquiry (admin only)
const respondToInquiry = async (req, res) => {
    const inquiryId = req.params.id;
    const { response } = req.body;

    let inquiry;

    try {
        inquiry = await Inquiry.findByIdAndUpdate(
            inquiryId,
            { response, status: "responded" }, // Update the response and status
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
    }
    return res.status(200).json({ inquiry });
};

// Get all inquiries for a user
const getUserInquiries = async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the authenticated request

    let inquiries;

    try {
        inquiries = await Inquiry.find({ user: userId }).populate("booking"); // Populate booking details
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!inquiries || inquiries.length === 0) {
        return res.status(404).json({ message: "No inquiries found" });
    }
    return res.status(200).json({ inquiries });
};

// Get all inquiries (admin only)
const getAllInquiries = async (req, res) => {
    let inquiries;

    try {
        inquiries = await Inquiry.find().populate("booking user"); // Populate booking and user details
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    if (!inquiries || inquiries.length === 0) {
        return res.status(404).json({ message: "No inquiries found" });
    }
    return res.status(200).json({ inquiries });
};

module.exports = {
    submitInquiry,
    respondToInquiry,
    getUserInquiries,
    getAllInquiries,
};