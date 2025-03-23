import React, { useState } from 'react';
import Nav from '../Navbar/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddBooking() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    nic: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history('/booking-details'));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/bookings", {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phone: inputs.phone,
        age: inputs.age,
        address: inputs.address,
        nic: inputs.nic,
      });
      console.log("Booking added successfully:", response.data);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      <Nav />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={inputs.lastName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            value={inputs.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={inputs.age}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={inputs.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">NIC Number:</label>
          <input
            type="text"
            name="nic"
            value={inputs.nic}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
}

export default AddBooking;
