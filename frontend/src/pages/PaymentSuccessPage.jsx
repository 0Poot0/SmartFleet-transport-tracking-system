import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
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

  const handleDownloadPDF = () => {
    if (!bookingData) return;

    try {
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
      pdf.text(bookingData.ticketID, 160, 28);

      // --- Body Section ---
      y = 70;
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('ROUTE INFORMATION', margin, y);
      
      y += 10;
      pdf.setTextColor(46, 125, 50);
      pdf.setFontSize(16);
      pdf.text(bookingData.route, margin, y);

      // Journey Details
      y += 20;
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('FROM', margin, y);
      pdf.text('TO', 110, y);
      
      y += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(bookingData.source, margin, y);
      pdf.text(bookingData.destination, 110, y);

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
      pdf.text(bookingData.passengerDetails.name, margin + 20, y);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Age:`, 110, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bookingData.passengerDetails.age.toString(), 130, y);
      
      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Gender:`, margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bookingData.passengerDetails.gender, margin + 20, y);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Phone:`, 110, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bookingData.passengerDetails.phone, 130, y);

      y += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Email:`, margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bookingData.passengerDetails.email, margin + 20, y);
      
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
      pdf.text(bookingData.seatNumbers.join(', '), margin, y);
      
      pdf.setFontSize(22);
      pdf.text(`INR ${bookingData.fare}`, 110, y);

      // Booking Timestamp
      y += 20;
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Booked on: ${formatDate(bookingData.timestamp)}`, margin, y);

      // QR Code Generation
      const qrDataStr = JSON.stringify({
        ticketID: bookingData.ticketID,
        passengerName: bookingData.passengerDetails.name,
        route: bookingData.route,
        source: bookingData.source,
        destination: bookingData.destination,
        seats: bookingData.seatNumbers.join(','),
        fare: bookingData.fare
      });

      // Render a hidden QR code canvas to get image data
      const qrContainer = document.createElement('div');
      qrContainer.style.display = 'none';
      document.body.appendChild(qrContainer);
      
      // We can't easily render a React component and get its canvas synchronously 
      // without adding it to the DOM. But since we need it for the PDF...
      // I'll use a simpler approach: add a hidden QR canvas in the main render 
      // and read it from there.
      const qrCanvas = document.querySelector('.hidden-qr-canvas canvas');
      if (qrCanvas) {
        const qrImgData = qrCanvas.toDataURL('image/png');
        pdf.addImage(qrImgData, 'PNG', 80, 220, 50, 50);
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Scan this code at boarding', 105, 275, { align: 'center' });
      }

      pdf.setFontSize(8);
      pdf.text('Thank you for choosing SmartFleet. Have a safe journey!', 105, 285, { align: 'center' });

      pdf.save(`SmartFleet-Ticket-${bookingData.ticketID}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
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
              onClick={handleDownloadPDF}
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
          
          {/* Hidden QR Code for PDF generation */}
          <div className="hidden-qr-canvas" style={{ display: 'none' }}>
            <QRCodeCanvas 
              value={JSON.stringify({
                ticketID: bookingData.ticketID,
                passengerName: bookingData.passengerDetails.name,
                route: bookingData.route,
                source: bookingData.source,
                destination: bookingData.destination,
                seats: bookingData.seatNumbers.join(','),
                fare: bookingData.fare
              })} 
              size={120} 
              level="H" 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;

