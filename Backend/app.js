require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/BookingRoutes");
const authRoutes = require("./Routes/authRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/bookings", router);
app.use("/auth", authRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI) // Use the MONGODB_URI from .env
    .then(() => {
        console.log("Connected to MongoDB");

        // Start the server
        const port = process.env.PORT || 5173; // Use PORT from .env or default to 5000
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });