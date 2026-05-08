import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Manual JWT decoding function
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      return decoded.user ? decoded.user.role : null;
    } catch (e) {
      return null;
    }
  };

  const updateAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = decodeToken(token);
      if (userRole) {
        setRole(userRole);
        setIsLoggedIn(true);
      } else {
        setRole(null);
        setIsLoggedIn(false);
      }
    } else {
      setRole(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    updateAuthStatus();

    const handleStorageChange = () => {
      updateAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  // Visibility logic based on role OR current route
  const isAdminNav = role === 'admin' || location.pathname.startsWith('/admin');
  const isPassengerNav = (role === 'passenger' || location.pathname.startsWith('/passenger')) && !isAdminNav;

  return (
    <nav className="navbar-component">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SmartFleet
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          
          {!isLoggedIn ? (
            <Link to="/login" className="navbar-link">Login</Link>
          ) : (
            <>
              {/* Common links */}
              <Link to="/live" className="navbar-link">Live<br />Tracking</Link>
              <Link to="/routes" className="navbar-link">View<br />Routes</Link>
              <Link to="/vehicles" className="navbar-link">Vehicles</Link>
              <Link to="/eta" className="navbar-link">ETA</Link>

              {/* Admin specific navigation (reordered to match request) */}
              {isAdminNav && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/analytics" className="navbar-link">AdvancedAnalytics</Link>
                  <Link to="/admin" className="navbar-link">AdminPanel</Link>
                </>
              )}

              {/* Passenger specific navigation */}
              {isPassengerNav && (
                <Link to="/passenger" className="navbar-link">Passenger<br />App</Link>
              )}

              <button onClick={handleLogout} className="navbar-link logout-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
