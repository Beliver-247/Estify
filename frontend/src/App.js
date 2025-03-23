import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import AddBooking from "./Components/AddBooking/AddBooking";
import Bookings from "./Components/BookingDetails/Bookings";
import UpdateBooking from "./Components/UpdateBooking/UpdateBooking";
import BookingAnalytics from "./Components/BookingDetails/Analize";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/add-booking" element={<AddBooking />} />
          <Route path="/booking-details" element={<Bookings />} />
          <Route path="/booking-details/:id" element={<UpdateBooking />} />
          <Route path="/BookingAnalytics" element={<BookingAnalytics/>}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
