import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Booking({ booking }) {
  const navigate = useNavigate();

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-red-600">
          No booking details available.
        </h1>
      </div>
    );
  }

  const { _id, firstName, lastName, email, phone, age, address, nic } = booking;

  // Function to handle delete
  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${_id}`);
      navigate("/booking-details"); // Redirect to the booking details page after deletion
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200 mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Booking Details
      </h1>
      <div className="space-y-6">
        {/* Booking Information */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Booking ID:</h2>
          <p className="text-xl font-light text-gray-600">{_id}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">First Name:</h2>
          <p className="text-xl font-light text-gray-600">{firstName}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Last Name:</h2>
          <p className="text-xl font-light text-gray-600">{lastName}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Email:</h2>
          <p className="text-xl font-light text-gray-600">{email}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Phone:</h2>
          <p className="text-xl font-light text-gray-600">{phone}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Age:</h2>
          <p className="text-xl font-light text-gray-600">{age}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Address:</h2>
          <p className="text-xl font-light text-gray-600">{address}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium text-gray-700">NIC Number:</h2>
          <p className="text-xl font-light text-gray-600">{nic}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        {/* Update Button */}
        <Link to={`/booking-details/${_id}`}>
          <button>Update</button>
        </Link>

        {/* Delete Button */}
        <button
          onClick={deleteHandler}
          className="text-lg font-medium py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Booking;
