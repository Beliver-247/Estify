import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddBooking = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/properties/${propertyId}`);
        if (response.data.propertyType !== 'rent') {
          setError('This property is not available for rent');
        }
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch property details');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData({
      ...formData,
      startDate: start,
      endDate: end
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate dates
    if (!formData.startDate || !formData.endDate) {
      setError('Please select booking dates');
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const bookingData = {
        propertyId,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post('http://localhost:5000/bookings', bookingData, config);
      
      if (response.data.booking) {
        setSuccess('Booking request submitted successfully!');
        setTimeout(() => navigate('/my-bookings'), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (err.response?.status === 400 ? 'Property is not available during the requested dates' : 
                         'Failed to submit booking');
      setError(errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!property) return <div className="error">Property not found</div>;
  if (error && error === 'This property is not available for rent') {
    return (
      <div className="booking-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2>Book Property: {property.title}</h2>
      <div className="property-info">
        <div className="property-image">
          {property.image && (
            <img 
              src={`http://localhost:5000/uploads/${property.image}`} 
              alt={property.title} 
            />
          )}
        </div>
        <div className="property-details">
          <p><strong>Type:</strong> For Rent</p>
          <p><strong>Location:</strong> {property.district}</p>
          <p><strong>Price:</strong> ${property.price.toLocaleString()} per day</p>
          <p><strong>Contact:</strong> {property.contactName} - {property.contactNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Select Rental Period</h3>
        
        <div className="form-group">
          <label>Booking Dates:</label>
          <DatePicker
            selectsRange
            startDate={formData.startDate}
            endDate={formData.endDate}
            onChange={handleDateChange}
            minDate={new Date()}
            placeholderText="Select date range"
            className="date-picker"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="button-group">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Booking Request
          </button>
        </div>
      </form>

      <style jsx>{`
        .booking-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .property-info {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        
        .property-image img {
          width: 300px;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .property-details {
          flex: 1;
        }
        
        .property-details p {
          margin: 10px 0;
        }
        
        .booking-form {
          background: #fff;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .date-picker {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          background: white;
          cursor: pointer;
        }
        
        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
        }
        
        .submit-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .submit-btn:hover {
          background-color: #45a049;
        }
        
        .cancel-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .cancel-btn:hover {
          background-color: #d32f2f;
        }
        
        .back-btn {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
          transition: background-color 0.3s;
        }
        
        .back-btn:hover {
          background-color: #0b7dda;
        }
        
        .error-message {
          color: #d32f2f;
          margin: 15px 0;
          padding: 10px;
          background: #ffebee;
          border-radius: 4px;
        }
        
        .success-message {
          color: #2e7d32;
          margin: 15px 0;
          padding: 10px;
          background: #e8f5e9;
          border-radius: 4px;
        }
        
        .loading, .error {
          text-align: center;
          padding: 50px;
          font-size: 18px;
        }
        
        .error {
          color: #d32f2f;
        }
        
        @media (max-width: 768px) {
          .property-info {
            flex-direction: column;
          }
          
          .property-image img {
            width: 100%;
          }
          
          .button-group {
            flex-direction: column;
          }
          
          .submit-btn, .cancel-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddBooking;