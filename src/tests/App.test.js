import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { FavoritesProvider } from '../context/FavoritesContext';

// Mock localStorage to prevent actual storage in the browser
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock the global fetch function
global.fetch = jest.fn();

// Create a helper function to render the App wrapped in its provider
const renderAppWithProvider = () => {
  return render(
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  );
};

// Clear mocks before each test to ensure a clean slate
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  fetch.mockClear();
});

describe('App Component', () => {
  // Test Case 1: Testing the API call and rendering search results
  it('should fetch and display movies when a search query is submitted', async () => {
    // Mock a successful API response with sample data
    const mockMovies = [
      {
        Title: 'The Matrix',
        Year: '1999',
        imdbID: 'tt0133093',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzQxMTY3NTczNl5BMl5BanBnXkFtZTcwMjEzMzc1Mw@@._V1_SX300.jpg',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ Response: 'True', Search: mockMovies }),
    });

    renderAppWithProvider();

    // Verify initial state: loading message is not present, and search message is
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.getByText(/start typing to search for movies/i)).toBeInTheDocument();

    // Find the search input and button
    const searchInput = screen.getByPlaceholderText(/search for a movie/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Simulate user typing and clicking the search button
    fireEvent.change(searchInput, { target: { value: 'Matrix' } });
    fireEvent.click(searchButton);

    // Verify loading state is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the API call to resolve and the results to be displayed
    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
      expect(screen.getByText('1999')).toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  // Test Case 2: Testing the favorites logic
  it('should add and remove a movie from the favorites list', async () => {
    // Mock a successful API response
    const mockMovie = {
      Title: 'The Matrix',
      Year: '1999',
      imdbID: 'tt0133093',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNzQxMTY3NTczNl5BMl5BanBnXkFtZTcwMjEzMzc1Mw@@._V1_SX300.jpg',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ Response: 'True', Search: [mockMovie] }),
    });

    renderAppWithProvider();

    // Simulate search to get a movie card to interact with
    const searchInput = screen.getByPlaceholderText(/search for a movie/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.change(searchInput, { target: { value: 'Matrix' } });
    fireEvent.click(searchButton);

    // Wait for the movie card to appear
    await waitFor(() => expect(screen.getByText('The Matrix')).toBeInTheDocument());

    // Verify initial state of favorites list
    const favoriteListHeading = screen.getByRole('heading', { name: /my favorites/i });
    expect(screen.getByText(/your favorites list is empty/i)).toBeInTheDocument();

    // Add the movie to favorites
    const addFavoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(addFavoriteButton);

    // Verify the movie is now in the favorites list
    expect(screen.queryByText(/your favorites list is empty/i)).not.toBeInTheDocument();
    expect(screen.getByText('The Matrix')).toBeInTheDocument(); // Appears in both lists
    
    // The button text should change to 'Remove from Favorites'
    expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();
    
    // Remove the movie from favorites
    const removeFavoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    fireEvent.click(removeFavoriteButton);

    // Verify the movie is no longer in the favorites list
    await waitFor(() => {
      // The movie card might still be rendered in the search results, so we check the favorites section
      const favoriteListSection = favoriteListHeading.parentElement;
      expect(favoriteListSection).toHaveTextContent(/your favorites list is empty/i);
    });
  });
});
