import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Nav() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <Link to="/mainhome" className="text-white hover:text-yellow-400 active:text-yellow-600">
            <h1 className="text-xl font-semibold">Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/add-booking" className="text-white hover:text-yellow-400 active:text-yellow-600">
            <h1 className="text-xl font-semibold">Add Booking</h1>
          </Link>
        </li>
        <li>
          <Link to="/booking-details" className="text-white hover:text-yellow-400 active:text-yellow-600">
            <h1 className="text-xl font-semibold">Booking Details</h1>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
