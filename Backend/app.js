require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const bookingRoutes = require("./Routes/BookingRoutes");
const authRoutes = require("./Routes/authRoutes"); // Import the authentication routes
const adminRoutes = require("./Routes/AdminRoutes"); // Import the admin routes
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/bookings", bookingRoutes); // Booking routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/admin", adminRoutes); // Admin routes

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