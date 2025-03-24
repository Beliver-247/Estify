// index.js
import dotenv from "dotenv"; // Import dotenv
dotenv.config(); // Load environment variables from .env file

import express from "express";
import mongoose from "mongoose";
import bookingRoutes from "./Routes/BookingRoutes.js"; // Adjusted path with .js extension
import authRoutes from "./Routes/AuthRoutes.js"; // Adjusted path with .js extension
import adminRoutes from "./Routes/AdminRoutes.js"; // Adjusted path to match previous naming
import inquiryRoutes from "./Routes/InquiryRoutes.js"; // Adjusted path with .js extension
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/bookings", bookingRoutes); // Booking routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/inquiries", inquiryRoutes); // Inquiry routes

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI) // Use the MONGODB_URI from .env
    .then(() => {
        console.log("Connected to MongoDB");

        // Start the server
        const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });