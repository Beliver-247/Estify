require("dotenv").config();

const express = require ("express");
const mongoose = require ("mongoose");
const router = require("./Routes/BookingRoutes");

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/bookings",router);



mongoose.connect("mongodb+srv://BookingUser:sEWr8CzwIFAPQgNP@cluster0.w7pyf.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));