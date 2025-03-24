// utils/jwt.js
import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || "realMe", // Use a strong secret key in production
        { expiresIn: "2h" } // Token expires in 1 hour
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
};