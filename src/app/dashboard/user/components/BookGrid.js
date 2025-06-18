// components/BookGrid.js
import BookCard from './BookCard';

export default function BookGrid({ books, onRent }) {
  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} onRent={onRent} />
      ))}
    </div>
  );
}
