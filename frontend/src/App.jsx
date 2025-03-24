import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import PropertyTable from "./components/Properties/Allproperties";
import AddBooking from "./components/Booking/addBooking";
import UserBookings from "./components/Booking/UserBookings";
import MyInquiries from "./components/Inquiry/MyInquiries";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/properties" element={<PropertyTable />} />
      <Route path="/bookings/:propertyId" element={<AddBooking />} />
      <Route path="/my-bookings" element={<UserBookings />} />
      <Route path="/my-inquiries" element={<MyInquiries />} />
    </Routes>
  );
}

export default App;
