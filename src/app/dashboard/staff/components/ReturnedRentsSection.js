'use client';
import React, { useState } from 'react';
import './PendingRentsSection.css';

export default function ReturnedRentsSection({ returnedRents }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter returned rents based on search term
  const filteredRents = returnedRents.filter(rent => {
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
      <h2>Returned Rentals</h2>
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
        <p className="empty">No returned rentals found.</p>
      ) : (
        filteredRents.map(rent => {
          const returnedAt = new Date(rent.books[0].returnedAt).toLocaleDateString();
          return (
            <div key={rent._id} className="rent-card">
              <header className="rent-card__header">
                <div className="rent-user">{rent.userId.email}</div>
                <div className="rent-dates">
                  <span>Returned: <time dateTime={rent.books[0].returnedAt}>{returnedAt}</time></span>
                </div>
              </header>
              <table className="rent-table">
                <thead>
                  <tr>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {rent.books.map(book => (
                    <tr key={book.bookId._id}>
                      <td>{book.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </section>
  );
}