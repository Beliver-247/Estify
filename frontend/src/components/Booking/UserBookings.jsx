import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDates, setEditDates] = useState({ startDate: null, endDate: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure we have an array and filter out invalid bookings
        const validBookings = Array.isArray(response.data.bookings) 
          ? response.data.bookings.filter(booking => booking && booking.property)
          : [];
        setBookings(validBookings);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        console.error('Fetch bookings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleEditClick = (booking) => {
    setEditingId(booking._id);
    setEditDates({
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate)
    });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setEditDates({ startDate: start, endDate: end });
  };

  const handleUpdateBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/bookings/${bookingId}`,
        {
          startDate: editDates.startDate,
          endDate: editDates.endDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(bookings.map(b => 
        b._id === bookingId ? response.data.booking : b
      ));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleInquiryClick = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const message = prompt('Enter your inquiry message:');
      if (!message) return;

      const response = await axios.post(
        'http://localhost:5000/inquiries',
        { bookingId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Inquiry submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry');
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status ? status.toUpperCase() : 'UNKNOWN'}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading your bookings...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Property</th>
                <th className="py-3 px-4 text-left">Dates</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="py-4 px-4">
                    <div
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => booking.property?._id && navigate(`/properties/${booking.property._id}`)}
                    >
                      <div className="font-medium">
                        {booking.property?.title || 'Unknown Property'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.property?.district || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {editingId === booking._id ? (
                      <DatePicker
                        selectsRange
                        startDate={editDates.startDate}
                        endDate={editDates.endDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        className="border rounded p-1 text-sm"
                      />
                    ) : (
                      `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
                    )}
                  </td>
                  <td className="py-4 px-4">
                    ${booking.price && booking.startDate && booking.endDate 
                      ? (booking.price * (
                          (new Date(booking.endDate) - new Date(booking.startDate)) 
                          / (1000 * 60 * 60 * 24)
                        )).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="py-4 px-4">
                    {editingId === booking._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateBooking(booking._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleEditClick(booking)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => navigate(`/bookings/${booking._id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            View
                          </button>
                        )}
                        <button
                          onClick={() => handleInquiryClick(booking._id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Inquire
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBookings;