// components/FilterControls.js
export default function FilterControls({
  searchQuery,
  setSearchQuery,
  genres,
  selectedGenres,
  handleGenreToggle,
}) {
  return (
    <div className="filter-controls">
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className="genre-checkboxes">
        {genres.map((genre) => (
          <label key={genre} className="genre-option">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreToggle(genre)}
            />
            {genre}
          </label>
        ))}
      </div>
    </div>
  );
}
