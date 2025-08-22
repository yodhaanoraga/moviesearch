import React from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ movies, onAddFavorite, onRemoveFavorite, favorites, isFavoriteList }) {
  if (movies.length === 0 && !isFavoriteList) {
    return null;
  }
  
  return (
    <div className="movie-list-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
          isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
        />
      ))}
    </div>
  );
}

export default MovieList;