import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:5001/api/properties/pending");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    await axios.post(`http://localhost:5001/api/properties/approve/${id}`);
    fetchPending();
  };

  const handleReject = async (id) => {
    await axios.delete(`http://localhost:5001/api/properties/reject/${id}`);
    fetchPending();
  };

  const filteredRequests = filterType === "all" ? requests : requests.filter(r => r.requestType === filterType);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="mb-6 text-center">
        <label className="mr-3 font-medium">Filter by Request Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border p-2 rounded">
          <option value="all">All</option>
          <option value="add">Add</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-center text-gray-600">No matching requests.</p>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row gap-4">
                {req.image && (
                  <img
                    src={`http://localhost:5001/uploads/${req.image}`}
                    alt={req.title}
                    className="h-48 w-full md:w-64 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{req.title}</h3>
                  <p className="text-gray-700 mb-2">{req.description}</p>
                  <p className="text-sm text-gray-600">Type: <span className="font-medium">{req.propertyType}</span></p>
                  <p className="text-sm text-gray-600">Request Type: <span className="capitalize font-medium">{req.requestType}</span></p>
                  <p className="text-sm text-gray-600 mt-2">Contact Person: <span className="font-medium">{req.contactName}</span></p>
                  <p className="text-sm text-gray-600">Contact Number: <span className="font-medium">{req.contactNumber}</span></p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;