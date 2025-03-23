const express = require("express");
const router = express.Router();
const AuthController = require("../Controller/AuthController");

// Register a new user
router.post("/register", AuthController.registerUser);

// Login a user
router.post("/login", AuthController.loginUser);

module.exports = router;