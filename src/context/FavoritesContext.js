import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new Context
const FavoritesContext = createContext();

// Create a custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);

// Create the Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage on component mount
  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(savedFavorites);
    } catch (e) {
      console.error("Failed to load favorites from localStorage", e);
      setFavorites([]);
    }
  }, []);

  // Save favorites to local storage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const addFavorite = (movie) => {
    // Check if the movie is already in favorites to prevent duplicates
    const isAlreadyFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (!isAlreadyFavorite) {
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
    }
  };

  const removeFavorite = (movie) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((fav) => fav.imdbID !== movie.imdbID)
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
