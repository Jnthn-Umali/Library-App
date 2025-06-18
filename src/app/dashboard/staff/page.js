// File: src/app/dashboard/staff/page.jsx
'use client';
import { useState, useEffect } from 'react';
import './staffdashboard.css';
import Sidebar from './components/Sidebar';
import BookModal from './components/BookModal';
import BookFilter from './components/BookFillter';
import BookGrid from './components/BookGrid';
import PendingRentsSection from './components/PendingRentsSection';

export default function StaffDashboard() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [pendingRents, setPendingRents] = useState([]);
  const [confirmedRents, setConfirmedRents] = useState([]);
  const [returnedRents, setReturnedRents] = useState([]); // New state for returned rents
  const [activeTab, setActiveTab] = useState('books');

  const fetchAllRents = async () => {
    try {
      const res = await fetch('/api/rents');
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setPendingRents(data.filter(r => r.status === 'pending') || []);
      setConfirmedRents(data.filter(r => r.status === 'confirmed') || []);
      setReturnedRents(data.filter(r => r.status === 'returned') || []);
    } catch (err) {
      console.error('Failed to fetch rents:', err);
      alert(`Failed to fetch rents: ${err.message}`);
      setPendingRents([]);
      setConfirmedRents([]);
      setReturnedRents([]);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/books');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setBooks(data || []);

      const genreSet = new Set();
      data.forEach(book => {
        if (Array.isArray(book.genre)) {
          book.genre.forEach(g => genreSet.add(g.trim()));
        } else if (book.genre) {
          book.genre.split(',').forEach(g => genreSet.add(g.trim()));
        }
      });
      setGenres([...genreSet]);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAllRents();
  }, []);

  const handleBookSaved = () => {
    fetchBooks();
    setShowForm(false);
    setEditingBook(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`Failed to delete book: ${res.status}`);
        }
        fetchBooks();
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book');
      }
    }
  };

  const handleDeleteRent = async (rentId) => {
    if (confirm('Are you sure you want to delete this pending rental?')) {
      try {
        const res = await fetch(`/api/rents/${rentId}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`Failed to delete rent: ${res.status}`);
        }
        alert('Rental deleted successfully');
        fetchAllRents();
      } catch (error) {
        console.error('Failed to delete rent:', error);
        alert('Failed to delete rent');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Logout failed: ${res.status}`);
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleConfirmRent = async (rentId) => {
    try {
      const res = await fetch(`/api/rents/${rentId}/confirm`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Confirmation failed: ${res.status} - ${data.error || 'Unknown error'}`);
      }

      const receiptRes = await fetch(`/api/rents/${rentId}/receipt`);
      if (!receiptRes.ok) {
        let receiptData;
        try {
          receiptData = await receiptRes.json();
        } catch (e) {
          receiptData = { error: 'Failed to parse error response' };
        }
        console.error('Receipt Error Details:', JSON.stringify(receiptData, null, 2));
        throw new Error(`Failed to fetch receipt: ${receiptRes.status} - ${receiptData.error || 'Unknown error'}`);
      }
      const blob = await receiptRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${rentId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Rental confirmed and receipt downloaded!');
      fetchBooks();
      fetchAllRents();
    } catch (err) {
      console.error('Failed to confirm rent or generate receipt:', err);
      alert(`Failed to confirm rent: ${err.message}`);
    }
  };

  const handleMarkReturned = async (rentId, bookId, currentStatus) => {
    try {
      const res = await fetch(`/api/rents/${rentId}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update return status');
      alert(currentStatus ? 'Book marked as not returned!' : 'Book marked as returned!');
      fetchAllRents();
    } catch (err) {
      console.error('Error updating return status:', err);
      alert(`Error updating return status: ${err.message}`);
    }
  };

  const filteredBooks = books.filter(book => {
    const term = searchTerm.toLowerCase();
    const authorMatch = book.author?.toLowerCase().includes(term) || false;
    const titleMatch = book.title?.toLowerCase().includes(term) || false;

    const genreList = Array.isArray(book.genre)
      ? book.genre.map(g => g.trim())
      : book.genre?.split(',').map(g => g.trim()) || [];
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some(g => genreList.includes(g));

    return (authorMatch || titleMatch) && genreMatch;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="dashboard-container">
        <p className="welcome-text">Welcome, Staff!</p>

        {activeTab === 'books' && (
          <>
            <div className="add-book-section">
              <button
                onClick={() => {
                  setEditingBook(null);
                  setShowForm(true);
                }}
                className="add-book-button"
              >
                Add Book
              </button>
            </div>

            <BookModal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setEditingBook(null);
              }}
              onBookSaved={handleBookSaved}
              editingBook={editingBook}
            />

            <BookFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreChange}
            />

            {loading ? (
              <p className="loading-text">Loading…</p>
            ) : (
              <BookGrid
                books={filteredBooks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {activeTab === 'pending' && (
          <PendingRentsSection
            pendingRents={pendingRents}
            onConfirmRent={handleConfirmRent}
            onDeleteRent={handleDeleteRent}
          />
        )}
          {/* … earlier tabs … */}

{activeTab === 'confirmed' && (
  <section className="rent-section">
    <h2>Confirmed Rentals</h2>
    {confirmedRents.length === 0
      ? <p className="empty">No confirmed rentals.</p>
      : confirmedRents.map(rent => {
          // assume each book entry has rentedAt and dueDate
          const rentedAt = new Date(rent.books[0].rentedAt).toLocaleDateString();
          const dueDate   = new Date(rent.books[0].dueDate).toLocaleDateString();
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rent.books.map(book => (
                    <tr key={book.bookId._id}>
                      <td>{book.title}</td>
                      <td>{book.returned ? 'Returned' : 'Outstanding'}</td>
                      <td>
                        <button
                          className="btn--small"
                          onClick={() =>
                            handleMarkReturned(
                              rent._id,
                              book.bookId._id,
                              book.returned
                            )
                          }
                        >
                          {book.returned ? 'Undo Return' : 'Mark Returned'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
    }
  </section>
)}


        

        {activeTab === 'return' && (
          <div>
            <h3>Return Books</h3>
            {confirmedRents
              .filter(rent => rent.books.some(book => !book.returned))
              .map(rent => (
                <div key={rent._id} className="rent-card">
                  <p><strong>User:</strong> {rent.userId.email}</p>
                  <ul>
                    {rent.books
                      .filter(book => !book.returned)
                      .map(book => (
                        <li key={book.bookId}>
                          {book.title}
                          <button
                            className="mark-returned-button"
                            onClick={() => handleMarkReturned(rent._id, book.bookId._id, book.returned)}
                          >
                            Mark as Returned
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}