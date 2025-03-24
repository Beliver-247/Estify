// PropertyModel.js
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"],
    },
    contactName: {
        type: String,
        required: [true, "Contact name is required"],
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
    },
    propertyType: {
        type: String,
        enum: ["rent", "selling"],
        required: [true, "Property type is required"],
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
    },
    requestType: {
        type: String,
        enum: ["add", "update", "delete"],
        default: "add",
    },
    originalPropertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
    },
}, {
    timestamps: true,
});

export default mongoose.model("Property", propertySchema);