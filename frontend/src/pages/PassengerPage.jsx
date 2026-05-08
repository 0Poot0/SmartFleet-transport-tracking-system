import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';
import './HomePage.css';

const PassengerPage = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const cards = [
    { title: 'View Routes', description: 'Explore all available transport routes and view detailed stop information.', icon: '🗺️', link: '/routes' },
    { title: 'Vehicles', description: 'Track live locations and status of all vehicles in the fleet.', icon: '🚌', link: '/vehicles' },
    { title: 'ETA', description: 'Get accurate estimated times of arrival for your chosen stop.', icon: '⏱️', link: '/eta' },
    { title: 'Passenger App', description: 'Access full mobile passenger features including search and bookings.', icon: '📱', link: '/passenger/search' },
    { title: 'Ticket Booking', description: 'Book your tickets easily online', icon: '🎫', link: '/ticket-booking' },
    { title: 'Payment', description: 'Secure online payment for your journey', icon: '💳', link: '/payment' }
  ];

  return (
    <div className="homepage">
      {/* Local navbar removed to use global Navbar from App.jsx */}

      <main style={{ padding: '4rem 2rem', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1b5e20', fontSize: '2.5rem' }}>Welcome, Passenger</h1>
          <p style={{ textAlign: 'center', marginBottom: '4rem', color: '#666', fontSize: '1.2rem' }}>Select a service to get started with your journey</p>
          
          <div className="features-container">
            {cards.map((card, index) => (
              <Link to={card.link} key={index} style={{ textDecoration: 'none' }}>
                <div className="feature-card">
                  <span className="feature-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'block' }}>{card.icon}</span>
                  <h3 className="feature-title" style={{ color: '#1b5e20', fontSize: '1.5rem', marginBottom: '1rem' }}>{card.title}</h3>
                  <p className="feature-description">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="homepage-footer">
        <div className="footer-container">
          <p className="footer-text">&copy; 2026 SmartFleet Transport Tracking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PassengerPage;
