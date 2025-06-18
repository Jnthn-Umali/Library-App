'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function AdminAnalytics({ users = [], books = [], rentals = [] }) {
  // --- Rentals per day ---
  const dailyRentalsMap = {};

  rentals.forEach((rental, i) => {
    const timestamp = rental.rentedAt || rental.createdAt;
    if (timestamp) {
      const dateObj = new Date(timestamp);
      if (!isNaN(dateObj)) {
        const formattedDate = dateObj.toISOString().split('T')[0];
        dailyRentalsMap[formattedDate] = (dailyRentalsMap[formattedDate] || 0) + 1;
      } else {
        console.warn(`Invalid date in rental[${i}]:`, timestamp);
      }
    } else {
      console.warn(`Missing timestamp in rental[${i}]`, rental);
    }
  });

  const dailyRentalsData = Object.entries(dailyRentalsMap).map(([date, count]) => ({ date, count }));

  // --- Most Rented Books ---
  const bookFrequencyMap = {};
  rentals.forEach(rental => {
    rental.books.forEach(book => {
      bookFrequencyMap[book.title] = (bookFrequencyMap[book.title] || 0) + 1;
    });
  });
  const bookFrequencyData = Object.entries(bookFrequencyMap).map(([title, count]) => ({ title, count }));

  // --- Rentals by Status ---
  const statusMap = {};
  rentals.forEach(rental => {
    statusMap[rental.status] = (statusMap[rental.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([status, count]) => ({ name: status, value: count }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📈 Admin Analytics</h2>

      <div style={{ height: 300 }}>
        <h3>📅 Rentals Per Day</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyRentalsData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300, marginTop: 40 }}>
        <h3>📚 Most Rented Books</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bookFrequencyData}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300, marginTop: 40 }}>
        <h3>📌 Rentals by Status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
