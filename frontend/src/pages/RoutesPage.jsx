import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RouteCard from '../components/RouteCard';
import './RoutesPage.css';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample routes data - replace with API call if needed
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleRoutes = [
        {
          id: 1,
          name: 'Route A - Downtown Express',
          stops: ['Central Station', 'Main Square', 'City Hall', 'Shopping District', 'Park Avenue']
        },
        {
          id: 2,
          name: 'Route B - North Loop',
          stops: ['North Terminal', 'University Campus', 'Sports Complex', 'Residential Area']
        },
        {
          id: 3,
          name: 'Route C - Coastal Line',
          stops: ['Beach Station', 'Marina', 'Harbor View', 'Lighthouse Point']
        },
        {
          id: 4,
          name: 'Route D - Industrial Zone',
          stops: ['Factory District', 'Warehouse Area', 'Logistics Center', 'Distribution Hub']
        },
        {
          id: 5,
          name: 'Route E - Airport Shuttle',
          stops: ['Airport Terminal', 'Hotel District', 'Convention Center', 'Downtown']
        },
        {
          id: 6,
          name: 'Route F - Suburban Connector',
          stops: ['Suburban Station', 'Green Park', 'Community Center', 'School District', 'Residential Complex']
        }
      ];
      setRoutes(sampleRoutes);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="routes-page">
      <Navbar />
      <main className="routes-main">
        <div className="routes-container">
          <h1 className="routes-title">Available Routes</h1>
          {loading ? (
            <div className="loading-state">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="empty-state">No routes available</div>
          ) : (
            <div className="routes-grid">
              {routes.map((route) => (
                <RouteCard key={route.id || route.name} route={route} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoutesPage;

