// src/app/dashboard/admin/components/BooksTable.js
'use client';
import React, { useState } from 'react';
import './LogsTable.css'; // ✅ Reusing same style for consistency

export default function BooksTable({ books }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.genre?.join(', ').toLowerCase().includes(query)
    );
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">Books</h2>
      <input
        type="text"
        placeholder="Search by title, author, or genre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="logs-search-input"
      />
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genres</th>
              <th>Year</th>
              <th>Copies</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre?.join(', ')}</td>
                <td>{book.year}</td>
                <td>{book.copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
