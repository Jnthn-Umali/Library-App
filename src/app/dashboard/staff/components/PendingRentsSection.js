'use client';
import React, { useState } from 'react';
import './PendingRentsSection.css';

export default function PendingRentsSection({ pendingRents, onConfirmRent, onDeleteRent }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pending rents based on search term
  const filteredRents = pendingRents.filter(rent => {
    const term = searchTerm.toLowerCase();
    const userMatch = rent.userId?.name?.toLowerCase().includes(term) || false;
    const bookMatch = rent.books.some(book => 
      book.title?.toLowerCase().includes(term) || 
      book.author?.toLowerCase().includes(term)
    );
    return userMatch || bookMatch;
  });

  return (
    <div className="pending-rents-section">
      <h2>Pending Rentals</h2>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by user, title, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {filteredRents.length === 0 ? (
        <p>No pending rentals found</p>
      ) : (
        <div className="pending-rents-list">
          {filteredRents.map((rent) => (
            <div key={rent._id} className="pending-rent-card">
              <p><strong>User:</strong> {rent.userId?.name || 'Unknown'}</p>
              <p><strong>Requested At:</strong> {new Date(rent.createdAt).toLocaleString()}</p>
              <ul>
                {rent.books.map((b, index) => (
                  <li key={index}>{b.title} by {b.author}</li>
                ))}
              </ul>
              <div className="rent-actions">
                <button
                  onClick={() => onConfirmRent(rent._id)}
                  className="confirm-button"
                >
                  Confirm Rent
                </button>
                <button
                  onClick={() => onDeleteRent(rent._id)}
                  className="delete-button"
                >
                  Delete Rent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}