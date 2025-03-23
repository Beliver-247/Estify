const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || "realMe", // Use a strong secret key in production
        { expiresIn: "1h" } // Token expires in 1 hour
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
};

module.exports = { generateToken, verifyToken };