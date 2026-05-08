import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import './PassengerHome.css';

const PassengerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Popular routes dummy data
  const popularRoutes = [
    {
      id: 1,
      name: 'Route A - Downtown Express',
      description: 'Fast express route connecting downtown areas',
      stops: 5
    },
    {
      id: 2,
      name: 'Route B - North Loop',
      description: 'Scenic route through northern areas',
      stops: 4
    },
    {
      id: 3,
      name: 'Route C - Coastal Line',
      description: 'Beautiful coastal route with harbor views',
      stops: 4
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/passenger/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="passenger-home">

      <main className="passenger-main">
        <div className="passenger-container">
          {/* Header Section */}
          <div className="home-header">
            <h1 className="home-title">Welcome to Passenger App</h1>
            <p className="home-subtitle">Find routes, track vehicles, and plan your journey</p>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Search for routes or stops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍 Search
              </button>
            </form>
          </div>

          {/* Quick Action Buttons */}
          <div className="quick-actions">
            <Link to="/ticket-booking" className="action-card">
              <div className="action-icon">🎫</div>
              <h3 className="action-title">Book a Ticket</h3>
              <p className="action-description">Book your journey ticket</p>
            </Link>
            <Link to="/passenger/routes" className="action-card">
              <div className="action-icon">🚌</div>
              <h3 className="action-title">Find Routes</h3>
              <p className="action-description">Browse all available routes</p>
            </Link>
            <Link to="/passenger/search" className="action-card">
              <div className="action-icon">📍</div>
              <h3 className="action-title">Live Vehicles Near Me</h3>
              <p className="action-description">Find nearby vehicles</p>
            </Link>
            <Link to="/passenger/routes" className="action-card">
              <div className="action-icon">🗺️</div>
              <h3 className="action-title">Track a Route</h3>
              <p className="action-description">Track your route in real-time</p>
            </Link>
          </div>

          {/* Popular Routes Section */}
          <div className="popular-routes-section">
            <h2 className="section-title">Popular Routes</h2>
            <div className="routes-grid">
              {popularRoutes.map((route) => (
                <Link
                  key={route.id}
                  to={`/passenger/route/${route.id}`}
                  className="route-card"
                >
                  <div className="route-card-header">
                    <div className="route-icon">🚌</div>
                    <div className="route-info">
                      <h3 className="route-name">{route.name}</h3>
                      <p className="route-stops">{route.stops} stops</p>
                    </div>
                  </div>
                  <p className="route-description">{route.description}</p>
                  <div className="route-card-footer">
                    <span className="view-route-link">View Route →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PassengerHome;

