import React from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ movies }) {
  if (movies.length === 0) {
    return null;
  }
  
  return (
    <div className="movie-list-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
}

export default MovieList;
