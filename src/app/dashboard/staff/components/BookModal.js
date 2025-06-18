// src/app/dashboard/staff/components/BookModal.js
import BookForm from './BookForm';
import './BookModal.css'; // optional: move modal-specific styles here

export default function BookModal({ isOpen, onClose, onBookSaved, editingBook }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingBook ? 'Edit Book' : 'Add Book'}</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <BookForm onBookAdded={onBookSaved} editingBook={editingBook} />
      </div>
    </div>
  );
}
