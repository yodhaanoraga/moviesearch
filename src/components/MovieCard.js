import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import './MovieCard.css';

function MovieCard({ movie }) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Check if the current movie is in the favorites list
  const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(movie);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.jp/300x300?text=No+Poster'}
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
