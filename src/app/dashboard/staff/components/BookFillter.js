// src/app/dashboard/staff/components/BookFilter.js
import React from 'react';

export default function BookFilter({
  searchTerm,
  onSearchChange,
  genres,
  selectedGenres,
  onGenreToggle,
}) {
  return (
    <div className="filter-section">
      <input
        type="text"
        placeholder="Search by author or title"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-input"
      />
      <div className="genre-filter">
        {genres.map((genre) => (
          <label key={genre} className="genre-label">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => onGenreToggle(genre)}
            />
            <span>{genre}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
