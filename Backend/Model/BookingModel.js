const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true, // Make it required if necessary
    },
});

module.exports = mongoose.model("BookingModel", bookingSchema);