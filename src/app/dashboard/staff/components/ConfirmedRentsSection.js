'use client';
import React, { useState } from 'react';
import './PendingRentsSection.css';

export default function ConfirmedRentsSection({
  confirmedRents,
  onMarkReturned,
  onExtendDueDate,
  selectedDueDates,
  setSelectedDueDates,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRents = confirmedRents.filter(rent => {
    const term = searchTerm.toLowerCase();
    const userMatch = rent.userId?.email?.toLowerCase().includes(term) || false;
    const bookMatch = rent.books.some(book =>
      book.title?.toLowerCase().includes(term) ||
      book.author?.toLowerCase().includes(term)
    );
    return userMatch || bookMatch;
  });

  return (
    <section className="rent-section">
      <h2>Confirmed Rentals</h2>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by user email, title, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {filteredRents.length === 0 ? (
        <p className="empty">No confirmed rentals found.</p>
      ) : (
        filteredRents.map(rent => {
          const rentedAt = new Date(rent.books[0].rentedAt).toLocaleDateString();
          const dueDate = new Date(rent.books[0].dueDate).toLocaleDateString();

          return (
            <div key={rent._id} className="rent-card">
              <header className="rent-card__header">
                <div className="rent-user">{rent.userId.email}</div>
                <div className="rent-dates">
                  <span>Rented: <time dateTime={rent.books[0].rentedAt}>{rentedAt}</time></span>
                  <span>Due: <time dateTime={rent.books[0].dueDate}>{dueDate}</time></span>
                </div>
              </header>
              <table className="rent-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Extend Due Date</th>
                    <th>Mark Returned</th>
                  </tr>
                </thead>
                <tbody>
                  {rent.books.map(book => {
                    const bookId = book.bookId._id.toString();
                    const uniqueKey = `${rent._id}-${bookId}`;

                    return (
                      <tr key={uniqueKey}>
                        <td>{book.title}</td>
                        <td>
                          <input
                            type="date"
                            value={selectedDueDates[uniqueKey] || ''}
                            onChange={(e) =>
                              setSelectedDueDates({
                                ...selectedDueDates,
                                [uniqueKey]: e.target.value,
                              })
                            }
                          />
                          <button
                            disabled={!selectedDueDates[uniqueKey]}
                            onClick={() =>
                              onExtendDueDate(rent._id, bookId, selectedDueDates[uniqueKey])
                            }
                          >
                            Extend
                          </button>
                        </td>
                        <td>
                          <button
                            className="mark-returned"
                            onClick={() => onMarkReturned(rent._id, bookId)}
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </section>
  );
}
