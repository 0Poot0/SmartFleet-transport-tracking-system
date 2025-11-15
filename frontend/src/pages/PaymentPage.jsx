import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [walletBalance] = useState(500); // Dummy wallet balance
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.booking) {
      setBookingData(location.state.booking);
    } else {
      // If no booking data, redirect to ticket booking
      navigate('/ticket-booking');
    }
  }, [location, navigate]);

  const fare = bookingData ? parseFloat(bookingData.fare) : 0;
  const tax = fare * 0.18; // 18% GST
  const total = fare + tax;

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  // Handle UPI ID change
  const handleUpiIdChange = (e) => {
    const value = e.target.value;
    setUpiId(value);
    if (errors.upiId) {
      setErrors(prev => ({ ...prev, upiId: '' }));
    }
  };

  // Handle card details change
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      formattedValue = cleaned.replace(/(.{4})/g, '$1 ').trim();
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      } else {
        formattedValue = cleaned;
      }
    }
    // Only allow numbers for CVV
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate UPI ID
  const validateUpiId = (upi) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upi);
  };

  // Validate card number
  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  // Validate expiry date
  const validateExpiryDate = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > new Date();
  };

  // Validate CVV
  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Process payment
  const handlePayment = async () => {
    setIsProcessing(true);
    setErrors({});

    // Validate based on payment method
    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        setErrors({ upiId: 'UPI ID is required' });
        setIsProcessing(false);
        return;
      }
      if (!validateUpiId(upiId)) {
        setErrors({ upiId: 'Please enter a valid UPI ID (e.g., name@paytm)' });
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === 'card') {
      const newErrors = {};
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(cardDetails.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!cardDetails.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!validateExpiryDate(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!validateCVV(cardDetails.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!cardDetails.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsProcessing(false);
        return;
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      if (paymentMethod === 'cash') {
        // Cash on arrival - always success
        navigate('/payment-success', {
          state: {
            booking: bookingData,
            payment: {
              method: 'Cash On Arrival',
              amount: total.toFixed(2),
              note: 'Pay to conductor when boarding.'
            }
          }
        });
      } else if (paymentMethod === 'wallet') {
        if (total <= walletBalance) {
          navigate('/payment-success', {
            state: {
              booking: bookingData,
              payment: {
                method: 'Wallet',
                amount: total.toFixed(2),
                remainingBalance: (walletBalance - total).toFixed(2)
              }
            }
          });
        } else {
          navigate('/payment-failed', {
            state: {
              booking: bookingData,
              reason: 'Insufficient wallet balance'
            }
          });
        }
      } else {
        // UPI or Card - 70% success rate
        const isSuccess = Math.random() > 0.3;
        if (isSuccess) {
          navigate('/payment-success', {
            state: {
              booking: bookingData,
              payment: {
                method: paymentMethod === 'upi' ? 'UPI' : 'Card',
                amount: total.toFixed(2)
              }
            }
          });
        } else {
          navigate('/payment-failed', {
            state: {
              booking: bookingData,
              reason: 'Payment processing failed. Please try again.'
            }
          });
        }
      }
    }, 2000);
  };

  if (!bookingData) {
    return (
      <div className="payment-page">
        <Navbar />
        <main className="payment-main">
          <div className="loading-state">Loading payment details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar />
      <main className="payment-main">
        <div className="payment-container">
          {/* Header */}
          <div className="payment-header">
            <h1 className="payment-title">Complete Payment</h1>
            <p className="payment-subtitle">Review your booking and proceed to payment</p>
          </div>

          <div className="payment-content">
            {/* Payment Summary Card */}
            <div className="summary-card">
              <h2 className="card-title">Booking Summary</h2>
              <div className="summary-item">
                <span className="summary-label">Route:</span>
                <span className="summary-value">{bookingData.route}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Journey:</span>
                <span className="summary-value">
                  {bookingData.source} → {bookingData.destination}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Seats:</span>
                <span className="summary-value">{bookingData.seatNumbers.join(', ')}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item">
                <span className="summary-label">Fare:</span>
                <span className="summary-value">₹{fare.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tax (18% GST):</span>
                <span className="summary-value">₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-item total-item">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-value">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods-section">
              <h2 className="section-title">Select Payment Method</h2>
              <div className="payment-methods-grid">
                <div
                  className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('upi')}
                >
                  <div className="method-icon">📱</div>
                  <div className="method-name">UPI</div>
                  <div className="method-subtitle">Google Pay, PhonePe, Paytm</div>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  <div className="method-icon">💳</div>
                  <div className="method-name">Card</div>
                  <div className="method-subtitle">Credit/Debit Card</div>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('wallet')}
                >
                  <div className="method-icon">💰</div>
                  <div className="method-name">Wallet</div>
                  <div className="method-subtitle">Balance: ₹{walletBalance}</div>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('cash')}
                >
                  <div className="method-icon">💵</div>
                  <div className="method-name">Cash</div>
                  <div className="method-subtitle">Pay on Arrival</div>
                </div>
              </div>
            </div>

            {/* Payment Form Based on Method */}
            {paymentMethod && (
              <div className="payment-form-section">
                {paymentMethod === 'upi' && (
                  <div className="payment-form">
                    <h3 className="form-title">Enter UPI Details</h3>
                    <div className="form-group">
                      <label htmlFor="upiId">UPI ID *</label>
                      <input
                        type="text"
                        id="upiId"
                        value={upiId}
                        onChange={handleUpiIdChange}
                        className={`form-input ${errors.upiId ? 'error' : ''}`}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                      <p className="form-hint">Example: john@paytm, jane@phonepe</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="payment-form">
                    <h3 className="form-title">Enter Card Details</h3>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardChange}
                          className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          className={`form-input ${errors.cvv ? 'error' : ''}`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardholderName">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleCardChange}
                        className={`form-input ${errors.cardholderName ? 'error' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="payment-form">
                    <h3 className="form-title">Wallet Payment</h3>
                    <div className="wallet-info">
                      <p>Available Balance: <strong>₹{walletBalance}</strong></p>
                      <p>Amount to Pay: <strong>₹{total.toFixed(2)}</strong></p>
                      {total > walletBalance && (
                        <p className="error-message">Insufficient balance. Please choose another payment method.</p>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="payment-form">
                    <h3 className="form-title">Cash On Arrival</h3>
                    <div className="cash-info">
                      <p>You will pay ₹{total.toFixed(2)} to the conductor when boarding the vehicle.</p>
                      <p className="cash-note">Please keep exact change ready.</p>
                    </div>
                  </div>
                )}

                {/* Pay Now Button */}
                <div className="payment-actions">
                  <button
                    className="pay-now-btn"
                    onClick={handlePayment}
                    disabled={isProcessing || (paymentMethod === 'wallet' && total > walletBalance)}
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => navigate('/ticket-booking')}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;

