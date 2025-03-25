// components/Admin/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access this page.');
          setTimeout(() => navigate('/login'), 2000); // Redirect after showing message
          return;
        }

        const response = await axios.get('http://localhost:5000/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: statusFilter },
        });

        const validBookings = Array.isArray(response.data.bookings)
          ? response.data.bookings.filter(booking => booking && booking.property)
          : [];
        setBookings(validBookings);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin role required.'); // Show access denied message
        } else {
          setError(err.response?.data?.message || 'Failed to fetch bookings');
        }
        console.error('Fetch bookings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, statusFilter]);

  const handleConfirmBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/admin/bookings/${bookingId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b._id === bookingId ? response.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/admin/bookings/${bookingId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b._id === bookingId ? response.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status ? status.toUpperCase() : 'UNKNOWN'}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return (
    <div className="text-center text-red-500 py-8">
      {error}
      {error.includes('Access denied') && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin - All Bookings</h1>
      {/* Status Filter */}
      <div className="mb-6">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found matching the selected filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Property</th>
                <th className="py-3 px-4 text-left">User</th>
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
                  <td className="py-4 px-4">{booking.user?.username || 'N/A'}</td>
                  <td className="py-4 px-4">{`${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`}</td>
                  <td className="py-4 px-4">
                    ${booking.price && booking.startDate && booking.endDate
                      ? (booking.price * ((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
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

export default AdminBookings;