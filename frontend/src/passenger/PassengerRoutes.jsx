import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';
import './PassengerRoutes.css';

const PassengerRoutes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  // Dummy routes data
  useEffect(() => {
    const sampleRoutes = [
      {
        id: 1,
        name: 'Route A - Downtown Express',
        description: 'Fast express route connecting downtown areas with major business districts.',
        stops: 5
      },
      {
        id: 2,
        name: 'Route B - North Loop',
        description: 'Scenic route through northern residential and university areas.',
        stops: 4
      },
      {
        id: 3,
        name: 'Route C - Coastal Line',
        description: 'Beautiful coastal route with harbor and beach views.',
        stops: 4
      },
      {
        id: 4,
        name: 'Route D - Industrial Zone',
        description: 'Efficient route connecting industrial and logistics centers.',
        stops: 4
      },
      {
        id: 5,
        name: 'Route E - Airport Shuttle',
        description: 'Direct connection from airport to downtown and hotels.',
        stops: 4
      },
      {
        id: 6,
        name: 'Route F - Suburban Connector',
        description: 'Comprehensive route linking suburban areas with city center.',
        stops: 5
      }
    ];
    setRoutes(sampleRoutes);
    setFilteredRoutes(sampleRoutes);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = routes.filter(
        route =>
          route.name.toLowerCase().includes(query) ||
          route.description.toLowerCase().includes(query)
      );
      setFilteredRoutes(filtered);
    }
  }, [searchQuery, routes]);

  return (
    <div className="passenger-routes">

      <main className="passenger-main">
        <div className="passenger-container">
          {/* Header Section */}
          <div className="routes-header">
            <h1 className="routes-title">Available Routes</h1>
            <p className="routes-subtitle">Choose a route to view details and track</p>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search routes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Routes Grid */}
          {filteredRoutes.length === 0 ? (
            <div className="empty-state">
              <p>No routes found matching your search.</p>
            </div>
          ) : (
            <div className="routes-grid">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="route-card">
                  <div className="route-card-header">
                    <div className="route-icon">🚌</div>
                    <div className="route-info">
                      <h3 className="route-name">{route.name}</h3>
                      <p className="route-stops">{route.stops} stops</p>
                    </div>
                  </div>
                  <p className="route-description">{route.description}</p>
                  <Link
                    to={`/passenger/route/${route.id}`}
                    className="view-route-button"
                  >
                    View Route →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PassengerRoutes;

