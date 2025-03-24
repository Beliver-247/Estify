import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bookingRoutes from "./Routes/BookingRoutes.js";
import authRoutes from "./Routes/AuthRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import inquiryRoutes from "./Routes/InquiryRoutes.js";
import propertyRoutes from "./Routes/propertyRoute.js"; // Added property routes
import cors from "cors";
import morgan from "morgan"; // For request logging
import helmet from "helmet"; // For security headers
import rateLimit from "express-rate-limit"; // For rate limiting
import { errorHandler } from "./Middleware/errorHandler.js"; // Custom error handler

const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/inquiries", inquiryRoutes);
app.use("/properties", propertyRoutes); // Added property routes
app.use("/uploads", express.static('uploads'));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

startServer();