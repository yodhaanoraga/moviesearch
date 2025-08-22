import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';
import './App.css';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load favorites from local storage on component mount
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const searchMovies = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}&s=${query}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error);
      }
    } catch (err) {
      setError('Failed to fetch movies. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (movie) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (!isAlreadyFavorite) {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (movie) => {
    const newFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Search App</h1>
        <SearchBar onSearch={searchMovies} />
      </header>

      <section className="movie-section">
        <h2>Search Results</h2>
        {loading && <p className="status-message">Loading...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p className="status-message">Start typing to search for movies!</p>
        )}
        <MovieList 
          movies={movies} 
          onAddFavorite={addFavorite} 
          onRemoveFavorite={removeFavorite}
          favorites={favorites} 
          isFavoriteList={false}
        />
      </section>

      <section className="favorites-section">
        <h2>My Favorites</h2>
        {favorites.length === 0 ? (
          <p className="status-message">Your favorites list is empty.</p>
        ) : (
          <MovieList 
            movies={favorites} 
            onAddFavorite={addFavorite} 
            onRemoveFavorite={removeFavorite}
            favorites={favorites} 
            isFavoriteList={true}
          />
        )}
      </section>
    </div>
  );
}

export default App;