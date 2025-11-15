import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TicketConfirmationPage.css';

const TicketConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
    } else {
      // If no booking data, redirect to booking page
      navigate('/ticket-booking');
    }
  }, [location, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateQRCodeData = () => {
    if (!booking) return '';
    return JSON.stringify({
      ticketID: booking.ticketID,
      passengerName: booking.passengerName,
      route: booking.route,
      source: booking.source,
      destination: booking.destination,
      seats: booking.seatNumbers.join(','),
      fare: booking.fare
    });
  };

  if (!booking) {
    return (
      <div className="ticket-confirmation-page">
        <Navbar />
        <main className="confirmation-main">
          <div className="loading-state">Loading ticket...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ticket-confirmation-page">
      <Navbar />
      <main className="confirmation-main">
        <div className="confirmation-container">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Booking Confirmed!</h1>
            <p className="success-subtitle">Your ticket has been booked successfully</p>
          </div>

          {/* Ticket Card */}
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-logo">
                <span className="logo-icon">🚌</span>
                <span className="logo-text">Transport Tracker</span>
              </div>
              <div className="ticket-id">
                <span className="ticket-id-label">Ticket ID</span>
                <span className="ticket-id-value">{booking.ticketID}</span>
              </div>
            </div>

            <div className="ticket-body">
              {/* Route Information */}
              <div className="ticket-section">
                <h3 className="section-label">Route</h3>
                <p className="section-value">{booking.route}</p>
              </div>

              {/* Journey Information */}
              <div className="ticket-section journey-section">
                <div className="journey-point">
                  <div className="point-icon">📍</div>
                  <div className="point-details">
                    <span className="point-label">From</span>
                    <span className="point-name">{booking.source}</span>
                  </div>
                </div>
                <div className="journey-arrow">→</div>
                <div className="journey-point">
                  <div className="point-icon">📍</div>
                  <div className="point-details">
                    <span className="point-label">To</span>
                    <span className="point-name">{booking.destination}</span>
                  </div>
                </div>
              </div>

              {/* Seat Information */}
              <div className="ticket-section">
                <h3 className="section-label">Seat Numbers</h3>
                <div className="seats-display">
                  {booking.seatNumbers.map((seat, index) => (
                    <span key={index} className="seat-badge">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fare Information */}
              <div className="ticket-section fare-section">
                <div className="fare-info">
                  <span className="fare-label">Total Fare</span>
                  <span className="fare-value">₹{booking.fare}</span>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="ticket-section passenger-section">
                <h3 className="section-label">Passenger Details</h3>
                <div className="passenger-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{booking.passengerDetails.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{booking.passengerDetails.age}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{booking.passengerDetails.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{booking.passengerDetails.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{booking.passengerDetails.email}</span>
                  </div>
                </div>
              </div>

              {/* Booking Time */}
              <div className="ticket-section">
                <h3 className="section-label">Booking Time</h3>
                <p className="section-value">{formatDate(booking.timestamp)}</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="ticket-footer">
              <div className="qr-code-section">
                <div className="qr-code-placeholder">
                  <div className="qr-code-icon">📱</div>
                  <p className="qr-code-text">QR Code</p>
                  <p className="qr-code-data">{booking.ticketID}</p>
                  <p className="qr-code-hint">Scan this code at the boarding point</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button
              className="action-btn download-btn"
              onClick={() => {
                // Optional: Implement download functionality
                alert('Download feature coming soon!');
              }}
            >
              📥 Download Ticket
            </button>
            <Link
              to="/ticket-booking"
              className="action-btn book-another-btn"
            >
              🎫 Book Another Ticket
            </Link>
            <Link
              to="/passenger"
              className="action-btn home-btn"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketConfirmationPage;

