import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onAddFavorite, onRemoveFavorite, isFavorite }) {
  const handleFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFavorite(movie);
    } else {
      onAddFavorite(movie);
    }
  };

  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={`${movie.Title} poster`}
      />
      <div className="movie-info">
        <h4>{movie.Title}</h4>
        <p>{movie.Year}</p>
        <button
          className={`favorite-btn ${isFavorite ? 'remove' : 'add'}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;