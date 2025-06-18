// src/app/dashboard/user/components/RentalHistory.jsx
'use client';
import { useState, useEffect } from 'react';
import './RentalHistory.css';

export default function RentalHistory() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const res = await fetch('/api/user/rentals');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setRentalHistory(data || []);
      } catch (err) {
        console.error('Error fetching rental history:', err);
        setError('Failed to fetch rental history');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, []);

  const filteredHistory = rentalHistory.filter(rent => {
    const hasOverdue = rent.books.some(book => book.overdue);
    const allReturned = rent.books.every(book => book.returned);
    const hasActive = rent.status === 'confirmed' && rent.books.some(book => !book.returned);
    const isPending = rent.status === 'pending';

    if (filter === 'returned') return allReturned || rent.status === 'returned';
    if (filter === 'overdue') return hasOverdue;
    if (filter === 'active') return hasActive;
    if (filter === 'pending') return isPending;
    return true; // 'all'
  });

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading rental history...</p>;

  return (
    <div className="rental-history">
      <h2>Your Rental History</h2>
      <div className="filter-controls">
        <label>Filter: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      {filteredHistory.length === 0 ? (
        <p>No rental history for the selected filter.</p>
      ) : (
        <ul>
          {filteredHistory.map(rent => (
            <li key={rent._id} className="rental-entry">
              <div><strong>Date:</strong> {new Date(rent.createdAt).toLocaleString()}</div>
              <div><strong>Status:</strong> {rent.status}</div>
              <ul>
                {rent.books.map((book, i) => (
                  <li key={i}>
                    📖 <strong>{book.title}</strong>{book.author !== 'Unknown' ? ` by ${book.author}` : ''} <br />
                    {book.dueDate ? (
                      <>
                        📅 <em>Due: {new Date(book.dueDate).toLocaleDateString()}</em>
                        {book.overdue && <span className="overdue-notice"> ⚠️ Overdue!</span>}
                        <br />
                      </>
                    ) : (
                      <span className="no-due-date">No due date set</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}