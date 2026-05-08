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

  const handleDownloadPDF = () => {
    if (!booking) return;

    try {
      // Create PDF in A4 size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      let y = 0;

      // --- Background / Header ---
      pdf.setFillColor(46, 125, 50); // #2e7d32
      pdf.rect(0, 0, 210, 50, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.text('SmartFleet', margin, 25);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('OFFICIAL E-TICKET', margin, 32);

      // --- Ticket ID ---
      pdf.setFontSize(10);
      pdf.text('TICKET ID', 160, 20);
      pdf.setFontSize(14);
      pdf.setFont('courier', 'bold');
      pdf.text(booking.ticketID, 160, 28);

      // --- Body Section ---
      y = 70;
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('ROUTE INFORMATION', margin, y);
      
      y += 10;
      pdf.setTextColor(46, 125, 50);
      pdf.setFontSize(16);
      pdf.text(booking.route, margin, y);

      // Journey Details
      y += 20;
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('FROM', margin, y);
      pdf.text('TO', 110, y);
      
      y += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(booking.source, margin, y);
      pdf.text(booking.destination, 110, y);

      // Separator
      y += 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, 190, y);
      
      // Passenger Section
      y += 15;
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('PASSENGER DETAILS', margin, y);
      
      y += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Name:`, margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.passengerDetails.name, margin + 20, y);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Age:`, 110, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.passengerDetails.age.toString(), 130, y);
      
      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Gender:`, margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.passengerDetails.gender, margin + 20, y);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Phone:`, 110, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.passengerDetails.phone, 130, y);

      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Email:`, margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.passengerDetails.email, margin + 20, y);
      
      // Separator
      y += 15;
      pdf.line(margin, y, 190, y);
      
      // Seat and Fare
      y += 15;
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('SEAT NUMBERS', margin, y);
      pdf.text('TOTAL FARE', 110, y);
      
      y += 10;
      pdf.setTextColor(46, 125, 50);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(booking.seatNumbers.join(', '), margin, y);
      
      pdf.setFontSize(22);
      pdf.text(`INR ${booking.fare}`, 110, y);

      // Booking Timestamp
      y += 20;
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Booked on: ${formatDate(booking.timestamp)}`, margin, y);

      // --- QR Code ---
      const qrCanvas = document.querySelector('canvas');
      if (qrCanvas) {
        const qrData = qrCanvas.toDataURL('image/png');
        pdf.addImage(qrData, 'PNG', 80, 220, 50, 50);
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Scan this code at boarding', 105, 275, { align: 'center' });
      }

      // Footer Note
      pdf.setFontSize(8);
      pdf.text('Thank you for choosing SmartFleet. Have a safe journey!', 105, 285, { align: 'center' });

      // Save PDF
      pdf.save(`SmartFleet-Ticket-${booking.ticketID}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download PDF. Please try again.');
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

