// components/BookCard.js
export default function BookCard({ book, onRent }) {
  return (
    <div className="book-card">
      <div className="book-image">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
      </div>
      <div className="book-details">
        <div className="book-title">{book.title}</div>
        <div className="book-meta">Author: {book.author}</div>
        <div className="book-meta">
          Genre: {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}
        </div>
      </div>
      <button
        className="rent-btn"
        onClick={() => onRent(book)}
        disabled={book.copies === 0}
      >
        {book.copies === 0 ? 'Out of Stock' : 'Rent'}
      </button>
    </div>
  );
}
