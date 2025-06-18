'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './AdminAnalytics.css';

export default function AdminAnalytics({ users = [], books = [], rentals = [], fetchAllData }) {
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

  // --- Overdue Users ---
  const overdueMap = {};
  rentals.forEach(rental => {
    if (rental.status === 'returned') {
      rental.books.forEach(book => {
        if (book.returnedAt && book.dueDate) {
          const returnedAt = new Date(book.returnedAt);
          const dueDate = new Date(book.dueDate);
          if (returnedAt > dueDate) {
            const userId = rental.userId?._id || 'unknown';
            overdueMap[userId] = (overdueMap[userId] || 0) + 1;
          }
        }
      });
    }
  });

  const overdueUsers = users
    .filter(user => (overdueMap[user._id] || 0) >= 3 && !user.isBanned)
    .map(user => ({
      ...user,
      overdueCount: overdueMap[user._id] || 0,
    }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const handleExportToCSV = () => {
    if (rentals.length === 0) {
      alert('No rental data to export');
      return;
    }

    const headers = [
      'User Email',
      'Book Titles',
      'Status',
      'Rented At',
      'Due Date',
      'Returned At',
    ];

    const rows = rentals.map(rent => {
      const bookTitles = rent.books.map(book => book.title).join('; ');
      const rentedAt = rent.books[0]?.rentedAt
        ? new Date(rent.books[0].rentedAt).toLocaleString()
        : '';
      const dueDate = rent.books[0]?.dueDate
        ? new Date(rent.books[0].dueDate).toLocaleString()
        : '';
      const returnedAt = rent.books[0]?.returnedAt
        ? new Date(rent.books[0].returnedAt).toLocaleString()
        : '';
      return [
        `"${rent.userId?.email || 'Unknown'}"`,
        `"${bookTitles}"`,
        rent.status,
        `"${rentedAt}"`,
        `"${dueDate}"`,
        `"${returnedAt}"`,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rentals_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBanUser = async (userId) => {
    if (!confirm(`Are you sure you want to ban this user?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Unknown error');
      }
      alert('User banned successfully');
      if (fetchAllData) fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert(`Failed to ban user: ${err.message}`);
    }
  };

  return (
    <div className="admin-analytics">
      <div className="analytics-container">
        <div className="analytics-header">
          <h2 className="analytics-title">📈 Admin Analytics</h2>
          <button className="export-button" onClick={handleExportToCSV}>
            Export to CSV
          </button>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📅 Rentals Per Day</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyRentalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📚 Most Rented Books</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📌 Rentals by Status</h3>
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="user-management-container">
          <h3 className="chart-title">🚫 User Management (Overdue Returns)</h3>
          {overdueUsers.length === 0 ? (
            <p className="empty">No users with frequent overdue returns.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Overdue Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overdueUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.overdueCount}</td>
                    <td>
                      <button
                        className="ban-button"
                        onClick={() => handleBanUser(user._id)}
                      >
                        Ban User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
