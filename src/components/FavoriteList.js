import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import MovieList from './MovieList';
import './MovieList.css';

function FavoriteList() {
  const { favorites } = useFavorites();

  return (
    <section className="favorites-section">
      <h2>My Favorites</h2>
      {favorites.length === 0 ? (
        <p className="status-message">Your favorites list is empty.</p>
      ) : (
        <MovieList movies={favorites} />
      )}
    </section>
  );
}

export default FavoriteList;
