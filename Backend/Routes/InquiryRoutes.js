const express = require("express");
const router = express.Router();
const InquiryController = require("../Controller/InquiryController");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");

// Submit an inquiry (logged-in users only)
router.post("/", authenticate, InquiryController.submitInquiry);

// Respond to an inquiry (admin only)
router.put("/:id/respond", authenticate, isAdmin, InquiryController.respondToInquiry);

// Get all inquiries for a user (logged-in users only)
router.get("/", authenticate, InquiryController.getUserInquiries);

// Get all inquiries (admin only)
router.get("/all", authenticate, isAdmin, InquiryController.getAllInquiries);

module.exports = router;