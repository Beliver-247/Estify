import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaHome, FaIdCard } from 'react-icons/fa';

const URL = 'http://localhost:5000/bookings';

const UpdateBooking = () => {
  const { id } = useParams(); // Get the booking ID from the URL
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    nic: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the booking details to populate the form
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setBooking(response.data); // Set the fetched booking data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to fetch booking details. Please try again.');
        setLoading(false);
      }
    };
  
    fetchBooking();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/${id}`, booking); // Send a PUT request to update the booking
      alert('Booking updated successfully!');
      navigate('/booking-details'); // ✅ Redirect to the bookings list
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking. Please try again.');
    }
  };
  

  // Display loading state
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  // Display error message
  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaUser className="text-gray-500 mr-3" />
    <input
      type="text"
      name="firstName"
      value={booking.firstName}
      onChange={handleInputChange}
      placeholder="First Name"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaUser className="text-gray-500 mr-3" />
    <input
      type="text"
      name="lastName"
      value={booking.lastName}
      onChange={handleInputChange}
      placeholder="Last Name"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaEnvelope className="text-gray-500 mr-3" />
    <input
      type="email"
      name="email"
      value={booking.email}
      onChange={handleInputChange}
      placeholder="Email"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaPhone className="text-gray-500 mr-3" />
    <input
      type="text"
      name="phone"
      value={booking.phone}
      onChange={handleInputChange}
      placeholder="Phone"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaBirthdayCake className="text-gray-500 mr-3" />
    <input
      type="number"
      name="age"
      value={booking.age}
      onChange={handleInputChange}
      placeholder="Age"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaHome className="text-gray-500 mr-3" />
    <input
      type="text"
      name="address"
      value={booking.address}
      onChange={handleInputChange}
      placeholder="Address"
      className="w-full outline-none"
      required
    />
  </div>

  <div className="flex items-center border rounded-lg px-3 py-2">
    <FaIdCard className="text-gray-500 mr-3" />
    <input
      type="text"
      name="nic"
      value={booking.nic}
      onChange={handleInputChange}
      placeholder="NIC"
      className="w-full outline-none"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
  >
    Update Booking
  </button>
</form>
    </div>
  );
};

export default UpdateBooking;
