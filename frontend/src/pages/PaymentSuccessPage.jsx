import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.booking && location.state.payment) {
      setBookingData(location.state.booking);
      setPaymentData(location.state.payment);
    } else {
      // If no data, redirect to ticket booking
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

  if (!bookingData || !paymentData) {
    return (
      <div className="payment-success-page">
        <Navbar />
        <main className="success-main">
          <div className="loading-state">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <Navbar />
      <main className="success-main">
        <div className="success-container">
          {/* Success Animation */}
          <div className="success-animation">
            <div className="success-icon">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">Your ticket has been confirmed</p>
          </div>

          {/* Ticket Details Card */}
          <div className="ticket-details-card">
            <div className="card-header">
              <h2 className="card-title">Booking Details</h2>
            </div>
            <div className="card-body">
              <div className="detail-row">
                <span className="detail-label">Ticket ID:</span>
                <span className="detail-value">{bookingData.ticketID}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Route:</span>
                <span className="detail-value">{bookingData.route}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Journey:</span>
                <span className="detail-value">
                  {bookingData.source} → {bookingData.destination}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Seats:</span>
                <span className="detail-value">{bookingData.seatNumbers.join(', ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount Paid:</span>
                <span className="detail-value amount">₹{paymentData.amount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{paymentData.method}</span>
              </div>
              {paymentData.note && (
                <div className="note-section">
                  <p className="note-text">ℹ️ {paymentData.note}</p>
                </div>
              )}
              {paymentData.remainingBalance && (
                <div className="balance-section">
                  <p className="balance-text">Remaining Wallet Balance: ₹{paymentData.remainingBalance}</p>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-value">{formatDate(bookingData.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <button
              className="action-btn download-btn"
              onClick={() => {
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
              🏠 Go to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;

