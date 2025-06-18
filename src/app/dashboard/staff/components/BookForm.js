'use client';

import { useState, useEffect } from 'react';
import './BookForm.css';

export default function BookForm({ onBookAdded, editingBook }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    copies: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title || '',
        author: editingBook.author || '',
        genre: Array.isArray(editingBook.genre)
          ? editingBook.genre.join(', ')
          : editingBook.genre || '',
        year: editingBook.year || '',
        copies: editingBook.copies || '',
      });
    } else {
      setForm({
        title: '',
        author: '',
        genre: '',
        year: '',
        copies: '',
      });
      setFile(null);
    }
    setError(null);
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('genre', form.genre);
    formData.append('year', form.year);
    formData.append('copies', form.copies);
    if (file) formData.append('image', file);

    try {
      const res = await fetch(`/api/books${editingBook ? `/${editingBook._id}` : ''}`, {
        method: editingBook ? 'PUT' : 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to save book');
      }

      await res.json();
      onBookAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-form-container">
      <form onSubmit={handleSubmit} className="book-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Enter genres (comma-separated)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Enter publication year"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="copies">Number of Copies</label>
          <input
            type="number"
            id="copies"
            name="copies"
            value={form.copies}
            onChange={handleChange}
            placeholder="Enter number of copies"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Book Cover Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : editingBook ? 'Update Book' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}