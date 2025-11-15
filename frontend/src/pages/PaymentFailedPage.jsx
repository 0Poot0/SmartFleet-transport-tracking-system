import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentFailedPage.css';

const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [failureReason, setFailureReason] = useState('');

  useEffect(() => {
    if (location.state && location.state.booking) {
      setBookingData(location.state.booking);
      setFailureReason(location.state.reason || 'Payment processing failed. Please try again.');
    }
  }, [location]);

  const handleRetryPayment = () => {
    if (bookingData) {
      navigate('/payment', { state: { booking: bookingData } });
    } else {
      navigate('/ticket-booking');
    }
  };

  return (
    <div className="payment-failed-page">
      <Navbar />
      <main className="failed-main">
        <div className="failed-container">
          {/* Failure Animation */}
          <div className="failure-animation">
            <div className="failure-icon">
              <svg className="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36" />
              </svg>
            </div>
            <h1 className="failure-title">Payment Failed</h1>
            <p className="failure-message">{failureReason}</p>
          </div>

          {/* Failure Details Card */}
          {bookingData && (
            <div className="failure-details-card">
              <div className="card-header">
                <h2 className="card-title">Booking Information</h2>
              </div>
              <div className="card-body">
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
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">₹{bookingData.fare}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="failure-actions">
            <button
              className="action-btn retry-btn"
              onClick={handleRetryPayment}
            >
              🔄 Retry Payment
            </button>
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

export default PaymentFailedPage;

