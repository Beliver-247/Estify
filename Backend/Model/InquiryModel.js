const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Booking model
        ref: "Booking",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        default: "", // Admin's response to the inquiry
    },
    status: {
        type: String,
        enum: ["pending", "responded"], // Inquiry status
        default: "pending", // Default status
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the `updatedAt` field before saving
inquirySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Inquiry", inquirySchema);