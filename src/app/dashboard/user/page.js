//src/app/dashboard/user/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './userdashboard.css';

import Topbar from './components/Topbar';
import FilterControls from './components/FilterControls';
import BookGrid from './components/BookGrid';
import CartDropdown from './components/CartDropdown';
import RentalHistory from './components/RentalHistory';

export default function UserDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [view, setView] = useState('books'); // 👈 'books' or 'history'

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);

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
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/session', { cache: 'no-store' });
        const data = await res.json();

        if (!data.isLoggedIn) {
          router.replace('/');
        } else if (data.user.role !== 'user') {
          router.replace('/unauthorized');
        } else {
          await fetchBooks();
          setLoading(false);
        }
      } catch (err) {
        console.error('Session check failed', err);
        router.replace('/');
      }
    };

    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleRent = (book) => {
    const alreadyRented = cart.find((b) => b.title === book.title);
    if (!alreadyRented) {
      setCart([...cart, book]);
    }
  };

  const handleConfirmRent = async () => {
    try {
      const response = await fetch('/api/rents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ books: cart }),
      });

      if (!response.ok) throw new Error('Failed to submit rent request');

      alert('Your rent request has been submitted! Please go to cashier, a staff will confirm it soon.');
      setCart([]);
      setShowCart(false);
    } catch (err) {
      alert('Error submitting rent. Try again later.');
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const filteredBooks = books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const genreList = Array.isArray(book.genre)
      ? book.genre.map(g => g.trim())
      : book.genre?.split(',').map(g => g.trim()) || [];

    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some(g => genreList.includes(g));

    return (titleMatch || authorMatch) && genreMatch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="topbar-container">
        <div className="view-toggle-buttons">
          <button onClick={() => setView('books')} className={view === 'books' ? 'active' : ''}>
            📚 Books
          </button>
          <button onClick={() => setView('history')} className={view === 'history' ? 'active' : ''}>
            🕒 Rental History
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {view === 'books' && (
        <>
          <h1 className="dashboard-header">📚 Available Books</h1>
          <Topbar cartCount={cart.length} onCartToggle={() => setShowCart(!showCart)} />
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            genres={genres}
            selectedGenres={selectedGenres}
            handleGenreToggle={handleGenreToggle}
          />
          <BookGrid books={filteredBooks} onRent={handleRent} />
          {showCart && (
            <CartDropdown
              cart={cart}
              onRemove={(id) => setCart(cart.filter((b) => b._id !== id))}
              onConfirm={handleConfirmRent}
            />
          )}
        </>
      )}

      {view === 'history' && <RentalHistory />}
    </div>
  );
}
