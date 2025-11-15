import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, logoutAdmin } from '../utils/auth';
import './HomePage.css';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
    
    const handleStorageChange = () => {
      setIsAdmin(isAdminLoggedIn());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Transport Tracker
          </Link>
          <div className="navbar-links">
            <Link to="/live" className="navbar-link">Live Tracking</Link>
            <Link to="/routes" className="navbar-link">View Routes</Link>
            <Link to="/vehicles" className="navbar-link">Vehicles</Link>
            <Link to="/eta" className="navbar-link">ETA</Link>
            {isAdmin && (
              <>
                <Link to="/admin" className="navbar-link">Admin</Link>
                <button onClick={handleLogout} className="navbar-link logout-button">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Transport Tracker</h1>
          <p className="hero-subtitle">
            Track any vehicle in real-time. Smart. Simple. Fast.
          </p>
          <div className="hero-buttons">
            <Link to="/live" className="hero-button primary">
              Live Tracking
            </Link>
            <Link to="/routes" className="hero-button secondary">
              View Routes
            </Link>
            <Link to="/vehicles" className="hero-button secondary">
              Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3 className="feature-title">Real-Time Simulation</h3>
            <p className="feature-description">
              Experience live vehicle tracking with real-time location updates and accurate positioning.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3 className="feature-title">Multiple Routes</h3>
            <p className="feature-description">
              Manage and monitor multiple vehicle routes simultaneously with ease and efficiency.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">Live Map</h3>
            <p className="feature-description">
              Interactive maps with detailed visualization of vehicle movements and locations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-container">
          <p className="footer-text">
            © 2024 Transport Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

