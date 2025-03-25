// components/Admin/AdminInquiries.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseText, setResponseText] = useState({});
  const token = localStorage.getItem("token");

  // Fetch all inquiries on component mount
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/inquiries/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInquiries(data.inquiries);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch inquiries");
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [token]);

  // Handle response submission
  const handleRespond = async (inquiryId) => {
    if (!responseText[inquiryId] || responseText[inquiryId].trim() === "") {
      setError("Response cannot be empty");
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:5000/inquiries/${inquiryId}/respond`,
        { response: responseText[inquiryId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the inquiry in the state
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry._id === inquiryId ? data.inquiry : inquiry
        )
      );
      setResponseText((prev) => ({ ...prev, [inquiryId]: "" })); // Clear the response input
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit response");
    }
  };

  if (loading) {
    return <div>Loading inquiries...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Inquiries</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>User</th>
              <th style={tableHeaderStyle}>Booking ID</th>
              <th style={tableHeaderStyle}>Message</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Response</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} style={tableRowStyle}>
                <td style={tableCellStyle}>
                  {inquiry.user?.email || "Unknown User"}
                </td>
                <td style={tableCellStyle}>{inquiry.booking?._id}</td>
                <td style={tableCellStyle}>{inquiry.message}</td>
                <td style={tableCellStyle}>{inquiry.status}</td>
                <td style={tableCellStyle}>
                  {inquiry.response || "No response yet"}
                </td>
                <td style={tableCellStyle}>
                  {inquiry.status === "pending" && (
                    <>
                      <textarea
                        value={responseText[inquiry._id] || ""}
                        onChange={(e) =>
                          setResponseText((prev) => ({
                            ...prev,
                            [inquiry._id]: e.target.value,
                          }))
                        }
                        placeholder="Type your response..."
                        rows="3"
                        style={{ width: "100%", marginBottom: "10px" }}
                      />
                      <button
                        onClick={() => handleRespond(inquiry._id)}
                        style={buttonStyle}
                      >
                        Submit Response
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Basic inline styles for the table and button
const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  verticalAlign: "top",
};

const buttonStyle = {
  padding: "5px 10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AdminInquiries;