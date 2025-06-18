// src/app/dashboard/admin/components/RentalsTable.js
'use client';

import React, { useState } from 'react';
import './LogsTable.css'; // Reuse existing styles

export default function RentalsTable({ rentals }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const filtered = rentals.filter((rent) => {
    const status = rent.status.toLowerCase();
    const userId = rent.userId?.email?.toLowerCase() || '';
    return (
      userId.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">Rentals</h2>
      <input
        type="text"
        placeholder="Search by email or status..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="logs-search-input"
      />
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Books</th>
              <th>Status</th>
              <th onClick={toggleSortOrder} className="sortable">
                Created At {sortOrder === 'desc' ? '↓' : '↑'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((rent) => (
              <tr key={rent._id}>
                <td>{rent.userId?.email || 'Unknown'}</td>
                <td>
                  <ul>
                    {rent.books.map((book, index) => {
                      const dueDate = book.dueDate ? new Date(book.dueDate) : null;
                      const isOverdue = dueDate && dueDate < new Date();

                      return (
                        <li key={`${book._id}-${index}`}>
                          {book.title} by {book.author}
                          {dueDate && (
                            <>
                              <br />
                              <span
                                style={{
                                  fontSize: '0.9em',
                                  color: isOverdue ? 'red' : 'gray',
                                }}
                              >
                                📅 Due: {dueDate.toLocaleDateString()}
                                {isOverdue && ' ⚠️ Overdue'}
                              </span>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>{rent.status}</td>
                <td>{new Date(rent.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
