import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TicketConfirmationPage.css';

const TicketConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const ticketRef = useRef(null);

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
      passengerName: booking.passengerDetails.name,
      route: booking.route,
      source: booking.source,
      destination: booking.destination,
      seats: booking.seatNumbers.join(','),
      fare: booking.fare
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const ticketElement = ticketRef.current;
    if (!ticketElement) return;

    try {
      // Temporarily add a class to ensure styling is perfect for canvas capture
      ticketElement.classList.add('pdf-capture-mode');
      
      const canvas = await html2canvas(ticketElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      ticketElement.classList.remove('pdf-capture-mode');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Center the ticket image horizontally and add some top margin
      const marginX = 10;
      const marginY = 20;
      const finalWidth = pdfWidth - (marginX * 2);
      const finalHeight = (canvas.height * finalWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
      pdf.save(`ticket-${booking.ticketID}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download PDF. Please try printing instead.');
    }
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
          {/* Success Header (Hidden in Print) */}
          <div className="success-header no-print">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Booking Confirmed!</h1>
            <p className="success-subtitle">Your ticket has been booked successfully</p>
          </div>

          {/* Ticket Card */}
          <div className="ticket-card" ref={ticketRef}>
            <div className="ticket-header">
              <div className="ticket-logo">
                <span className="logo-icon">🚌</span>
                <span className="logo-text">SmartFleet</span>
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
                <div className="qr-code-wrapper">
                  <QRCodeCanvas value={generateQRCodeData()} size={120} level="H" />
                  <p className="qr-code-hint">Scan this code at boarding</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden in Print) */}
          <div className="confirmation-actions no-print">
            <button className="action-btn download-btn" onClick={handleDownloadPDF}>
              Download PDF 📄
            </button>
            <button className="action-btn print-btn" onClick={handlePrint}>
              Print Ticket 🖨️
            </button>
            <Link to="/ticket-booking" className="action-btn book-another-btn">
              🎫 Book Another
            </Link>
            <Link to="/passenger" className="action-btn home-btn">
              🏠 Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketConfirmationPage;

