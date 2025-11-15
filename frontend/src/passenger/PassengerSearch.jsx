import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PassengerSearch.css';

const PassengerSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dummy data for routes and stops
  const routesData = [
    { id: 1, name: 'Route A - Downtown Express', type: 'route' },
    { id: 2, name: 'Route B - North Loop', type: 'route' },
    { id: 3, name: 'Route C - Coastal Line', type: 'route' },
    { id: 4, name: 'Route D - Industrial Zone', type: 'route' },
    { id: 5, name: 'Route E - Airport Shuttle', type: 'route' },
    { id: 6, name: 'Route F - Suburban Connector', type: 'route' }
  ];

  const stopsData = [
    { id: 1, name: 'Central Station', type: 'stop' },
    { id: 2, name: 'Main Square', type: 'stop' },
    { id: 3, name: 'City Hall', type: 'stop' },
    { id: 4, name: 'Shopping District', type: 'stop' },
    { id: 5, name: 'Park Avenue', type: 'stop' },
    { id: 6, name: 'North Terminal', type: 'stop' },
    { id: 7, name: 'University Campus', type: 'stop' },
    { id: 8, name: 'Beach Station', type: 'stop' },
    { id: 9, name: 'Airport Terminal', type: 'stop' },
    { id: 10, name: 'Suburban Station', type: 'stop' }
  ];

  const allData = [...routesData, ...stopsData];

  // Update search query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  // Perform search
  const performSearch = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtered = allData.filter(
      item => item.name.toLowerCase().includes(queryLower)
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    if (item.type === 'route') {
      window.location.href = `/passenger/route/${item.id}`;
    } else {
      window.location.href = `/stop/${item.id}`;
    }
  };

  return (
    <div className="passenger-search">
      <Navbar />
      <main className="passenger-main">
        <div className="passenger-container">
          {/* Header Section */}
          <div className="search-header">
            <h1 className="search-title">Search Routes & Stops</h1>
            <p className="search-subtitle">Find routes or stops by name</p>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Route Name or Stop Name..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <div className="suggestion-icon">
                          {item.type === 'route' ? '🚌' : '🚏'}
                        </div>
                        <div className="suggestion-content">
                          <div className="suggestion-name">{item.name}</div>
                          <div className="suggestion-type">
                            {item.type === 'route' ? 'Route' : 'Stop'}
                          </div>
                        </div>
                        <div className="suggestion-arrow">→</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="search-button">
                🔍 Search
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchQuery && suggestions.length === 0 && showSuggestions && (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <p className="no-results-hint">Try searching for a route or stop name</p>
            </div>
          )}

          {/* Quick Links */}
          {!searchQuery && (
            <div className="quick-links-section">
              <h2 className="section-title">Quick Links</h2>
              <div className="quick-links-grid">
                <Link to="/passenger/routes" className="quick-link-card">
                  <div className="quick-link-icon">🚌</div>
                  <h3>View All Routes</h3>
                </Link>
                <Link to="/passenger" className="quick-link-card">
                  <div className="quick-link-icon">🏠</div>
                  <h3>Passenger Home</h3>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PassengerSearch;

