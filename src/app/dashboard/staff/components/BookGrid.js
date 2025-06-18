import React from 'react';
import './BookGrid.css';

export default function BookGrid({ books, onEdit, onDelete }) {
  return (
    <div className="book-grid-container">
      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-image">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} />
              ) : (
                <div className="image-placeholder">No Image</div>
              )}
            </div>
            <div className="book-content">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
              <div className="book-genre-container">
                {(Array.isArray(book.genre)
                  ? book.genre
                  : book.genre?.split(',') || [])
                  .map(g => g.trim())
                  .map((g, i) => (
                    <span key={i} className="genre-badge">{g}</span>
                  ))}
              </div>
              <div className="book-details">
                <span className="book-year">{book.year}</span>
                <span className="book-copies">{book.copies} copies</span>
              </div>
            </div>
            <div className="button-overlay">
              <button
                onClick={() => onEdit(book)}
                className="edit-button"
                aria-label={`Edit ${book.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book._id)}
                className="delete-button"
                aria-label={`Delete ${book.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
