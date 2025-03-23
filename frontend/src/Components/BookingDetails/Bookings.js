import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Navbar/Nav';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaHome, FaIdCard, FaEdit, FaTrash } from 'react-icons/fa';

const URL = 'http://localhost:5000/bookings';

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchHandler();
        setBookings(data);
      } catch (error) {
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  // Function to delete a booking
  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id)); // Remove deleted booking from state
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  // Function to navigate to the update booking page
  const updateBooking = (id) => {
    navigate(`/booking-details/${id}`);
  };

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Booking Report', 10, 10);
    bookings.forEach((booking, index) => {
      const y = 20 + index * 40;
      doc.text(`Booking ${index + 1}:`, 10, y);
      doc.text(`First Name: ${booking.firstName}`, 20, y + 10);
      doc.text(`Last Name: ${booking.lastName}`, 20, y + 20);
      doc.text(`Email: ${booking.email}`, 20, y + 30);
    });
    doc.save('bookings_report.pdf');
  };

  // Navigate to analytics page
  const goToAnalytics = () => {
    navigate('/BookingAnalytics', { state: { bookings } });
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) => {
    const firstName = booking.firstName || '';
    const lastName = booking.lastName || '';
    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting functionality
  const sortedBookings = React.useMemo(() => {
    let sortableBookings = [...filteredBookings];
    if (sortConfig.key !== null) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [filteredBookings, sortConfig]);

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(sortedBookings.length / bookingsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Sort request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Nav />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center mb-8 text-3xl font-bold text-gray-800">Bookings Details</h1>

        {/* Buttons aligned to the left */}
        <div className="flex flex-col space-y-4 items-start mt-6">
          {/* Download PDF Button */}
          <button
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-lg transition duration-300 ease-in-out hover:from-green-600 hover:to-green-700 active:bg-green-800 shadow-md"
            onClick={downloadPDF}
          >
            Download PDF Report
          </button>

          {/* Analytics Button */}
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg transition duration-300 ease-in-out hover:from-blue-600 hover:to-blue-700 active:bg-blue-800 shadow-md"
            onClick={goToAnalytics}
          >
            View Analytics
          </button>
        </div>

        {/* Search input field */}
        <div className="w-full max-w-md mx-auto mt-6">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sorting buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => requestSort('firstName')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Sort by First Name
          </button>
          <button
            onClick={() => requestSort('lastName')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Sort by Last Name
          </button>
        </div>

        {/* Loading and error messages */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        {error && <p className="text-center text-lg text-red-600 mt-4">{error}</p>}

        {/* Bookings grid */}
        <div className="grid mt-8 gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 border border-gray-200 rounded-xl hover:transform hover:translate-y-1 hover:shadow-lg transition-transform duration-300"
              >
                {/* Booking Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-purple-600" />
                    {booking.firstName} {booking.lastName}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    <span className="font-medium">Email:</span> {booking.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaPhone className="mr-2 text-green-500" />
                    <span className="font-medium">Phone:</span> {booking.phone}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaBirthdayCake className="mr-2 text-yellow-500" />
                    <span className="font-medium">Age:</span> {booking.age}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaHome className="mr-2 text-indigo-500" />
                    <span className="font-medium">Address:</span> {booking.address}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaIdCard className="mr-2 text-red-500" />
                    <span className="font-medium">NIC:</span> {booking.nic}
                  </p>
                </div>

                {/* Update and Delete Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                <button
  onClick={() => updateBooking(booking._id)}
  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
>
  <FaEdit />
</button>

                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center mt-8">
                <p className="text-lg text-gray-600">No bookings found.</p>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-5 py-2 mx-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-md disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: Math.ceil(sortedBookings.length / bookingsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-5 py-2 mx-2 ${
                currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
              } rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out shadow-md`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(sortedBookings.length / bookingsPerPage)}
            className="px-5 py-2 mx-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bookings;