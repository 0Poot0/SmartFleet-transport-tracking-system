import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, logoutAdmin } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
    
    // Listen for storage changes (in case of logout from another tab)
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
    <nav className="navbar-component">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Transport Tracker
        </Link>
        <div className="navbar-links">
          <Link to="/live" className="navbar-link">Live Tracking</Link>
          <Link to="/routes" className="navbar-link">View Routes</Link>
          <Link to="/vehicles" className="navbar-link">Vehicles</Link>
          <Link to="/eta" className="navbar-link">ETA</Link>
          <Link to="/passenger" className="navbar-link">Passenger App</Link>
          {isAdmin && (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/analytics" className="navbar-link">Analytics</Link>
              <Link to="/admin" className="navbar-link">Admin</Link>
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

