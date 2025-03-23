import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function BookingAnalytics() {
  const location = useLocation();
  const bookings = location.state?.bookings || [];

  // Prepare data for the bar chart (Age Groups)
  const ageGroups = {
    '0-18': 0,
    '19-30': 0,
    '31-50': 0,
    '51+': 0,
  };

  bookings.forEach((booking) => {
    const age = booking.age || 0;
    if (age <= 18) ageGroups['0-18']++;
    else if (age <= 30) ageGroups['19-30']++;
    else if (age <= 50) ageGroups['31-50']++;
    else ageGroups['51+']++;
  });

  // Bar Chart Data (Age Groups)
  const barChartData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: 'Number of Bookings',
        data: Object.values(ageGroups),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data (Age Groups)
  const pieChartData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: 'Age Group Distribution',
        data: Object.values(ageGroups),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(75, 192, 192, 0.6)', // Green
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Age Group (Bar Chart)',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Age Group (Pie Chart)',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-center mb-8 text-3xl font-bold text-gray-800">Booking Analytics</h1>

      {/* Flex Container for Charts */}
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Bar Chart */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Age Group Distribution (Bar Chart)</h2>
          <div className="h-96"> {/* Fixed height for the chart */}
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Age Group Distribution (Pie Chart)</h2>
          <div className="h-96"> {/* Fixed height for the chart */}
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Raw Data Table */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">Raw Booking Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Age</th>
                <th className="py-2 px-4 border-b">Gender</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{booking.firstName}</td>
                  <td className="py-2 px-4 border-b">{booking.lastName}</td>
                  <td className="py-2 px-4 border-b">{booking.email}</td>
                  <td className="py-2 px-4 border-b">{booking.age}</td>
                  <td className="py-2 px-4 border-b">{booking.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingAnalytics;