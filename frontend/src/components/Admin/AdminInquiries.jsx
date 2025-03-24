// AdminInquiries.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  CircularProgress,
} from '@mui/material';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching inquiries...');
    console.log('Token:', localStorage.getItem('token'));
    try {
      const res = await axios.get('/inquiries/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('API Response:', res.data);
      const inquiryData = Array.isArray(res.data.inquiries) ? res.data.inquiries : [];
      console.log('Processed Inquiries:', inquiryData);
      setInquiries(inquiryData);
    } catch (err) {
      console.error('Error fetching inquiries:', err.response?.data || err.message);
      setError(`Failed to load inquiries: ${err.response?.data?.message || err.message}`);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponse(inquiry.response || '');
    setOpenModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await axios.put(
        `/inquiries/${selectedInquiry._id}`,
        { response },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const updatedInquiry = res.data.inquiry;
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === updatedInquiry._id ? updatedInquiry : inq))
      );
      setOpenModal(false);
      setSelectedInquiry(null);
      setResponse('');
    } catch (err) {
      console.error('Error responding to inquiry:', err.response?.data || err.message);
      alert('Failed to submit response. Please try again.');
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Inquiries
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : inquiries.length === 0 ? (
        <Typography align="center">No inquiries available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Response</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>{inquiry.user?.username || 'Unknown'}</TableCell>
                  <TableCell>{inquiry.booking?._id || 'N/A'}</TableCell>
                  <TableCell>{inquiry.message}</TableCell>
                  <TableCell>{inquiry.response || 'No response yet'}</TableCell>
                  <TableCell>{inquiry.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRespondClick(inquiry)}
                    >
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Respond to Inquiry
          </Typography>
          {selectedInquiry && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>User:</strong> {selectedInquiry.user?.username || 'Unknown'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Message:</strong> {selectedInquiry.message}
              </Typography>
              <TextField
                label="Response"
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitResponse}
                >
                  Submit Response
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminInquiries;