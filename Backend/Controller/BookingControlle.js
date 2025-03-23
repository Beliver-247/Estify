const Booking = require("../Model/BookingModel");



// Get all bookings
const getAllBooking = async (req, res) => {

    let bookings; 

    try {
        bookings = await Booking.find();
    
    } catch (err) {
        console.log(err);
    }

    if(!bookings){
        return res.status(404).json({message: "Booking not found"});
    }

    return res.status(200).json({bookings})
};

const addBookings = async (req, res, next) => {
    const { firstName, lastName, email, phone, age, address, nic } = req.body;

    let bookings;

    try {
        bookings = new Booking({ firstName, lastName, email, phone, age, address, nic });
        await bookings.save();
    } catch (err) {
        console.log(err);
    }

    if (!bookings) {
        return res.status(404).json({ message: "Unable to add booking" });
    }
    return res.status(200).json({ bookings });
};

const getById = async (req, res, next) =>{

    const id = req.params.id;

    let bookings;
    
    try {
        bookings = await Booking.findById(id); 

    }catch (err){
        console.log(err);
    }
    if (!bookings){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({bookings});
};

const updateBooking = async (req, res, next) => {
    const id = req.params.id;
    const { firstName, lastName, email, phone, age, address, nic } = req.body;

    let bookings;

    try {
        bookings = await Booking.findByIdAndUpdate(
            id,
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                age: age,
                address: address,
                nic: nic,
            },
            { new: true } // { new: true } returns the updated document
        );
    } catch (err) {
        console.log(err);
    }

    if (!bookings) {
        return res.status(404).json({ message: "Unable to update booking details" });
    }
    return res.status(200).json({ bookings });
};

const deleteBooking = async (req, res, next) => {
    const id = req.params.id;

    let bookings;

    try{
      bookings = await Booking.findByIdAndDelete(id);
    }catch (err){
      console.log(err);
    }
    if (!bookings){
        return res.status(404).json({message:"unable to delete booking detailes"});
      }
    return res.status(200).json({bookings});
    
};


exports.getAllBooking = getAllBooking;
exports.addBookings = addBookings;
exports.getById = getById;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
