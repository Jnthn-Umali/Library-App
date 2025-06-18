import React from 'react';
import './PendingRentsSection.css';

export default function PendingRentsSection({ pendingRents, onConfirmRent, onDeleteRent }) {
  return (
    <div className="pending-rents-section">
      <h2>Pending Rentals</h2>
      {pendingRents.length === 0 ? (
        <p>No pending rentals</p>
      ) : (
        <div className="pending-rents-list">
          {pendingRents.map((rent) => (
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
