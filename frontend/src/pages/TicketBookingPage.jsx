import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TicketBookingPage.css';

const TicketBookingPage = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [sourceStop, setSourceStop] = useState('');
  const [destinationStop, setDestinationStop] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [fare, setFare] = useState(0);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  // Dummy routes data with stops
  const routesData = [
    {
      id: 1,
      name: 'Route A - Downtown Express',
      stops: [
        { id: 1, name: 'Central Station', order: 1 },
        { id: 2, name: 'Main Square', order: 2 },
        { id: 3, name: 'City Hall', order: 3 },
        { id: 4, name: 'Shopping District', order: 4 },
        { id: 5, name: 'Park Avenue', order: 5 }
      ]
    },
    {
      id: 2,
      name: 'Route B - North Loop',
      stops: [
        { id: 6, name: 'North Terminal', order: 1 },
        { id: 7, name: 'University Campus', order: 2 },
        { id: 11, name: 'Sports Complex', order: 3 },
        { id: 12, name: 'Residential Area', order: 4 }
      ]
    },
    {
      id: 3,
      name: 'Route C - Coastal Line',
      stops: [
        { id: 8, name: 'Beach Station', order: 1 },
        { id: 13, name: 'Marina', order: 2 },
        { id: 14, name: 'Harbor View', order: 3 },
        { id: 15, name: 'Lighthouse Point', order: 4 }
      ]
    },
    {
      id: 4,
      name: 'Route D - Industrial Zone',
      stops: [
        { id: 16, name: 'Factory District', order: 1 },
        { id: 17, name: 'Warehouse Area', order: 2 },
        { id: 18, name: 'Logistics Center', order: 3 },
        { id: 19, name: 'Distribution Hub', order: 4 }
      ]
    },
    {
      id: 5,
      name: 'Route E - Airport Shuttle',
      stops: [
        { id: 9, name: 'Airport Terminal', order: 1 },
        { id: 20, name: 'Hotel District', order: 2 },
        { id: 21, name: 'Convention Center', order: 3 },
        { id: 22, name: 'Downtown', order: 4 }
      ]
    },
    {
      id: 6,
      name: 'Route F - Suburban Connector',
      stops: [
        { id: 10, name: 'Suburban Station', order: 1 },
        { id: 23, name: 'Green Park', order: 2 },
        { id: 24, name: 'Community Center', order: 3 },
        { id: 25, name: 'School District', order: 4 },
        { id: 26, name: 'Residential Complex', order: 5 }
      ]
    }
  ];

  // Generate seat grid (4 rows x 5 columns = 20 seats)
  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D'];
    const bookedSeats = ['A1', 'B3', 'C5', 'D2']; // Random booked seats
    
    rows.forEach((row, rowIndex) => {
      for (let col = 1; col <= 5; col++) {
        const seatId = `${row}${col}`;
        seats.push({
          id: seatId,
          row: row,
          number: col,
          isBooked: bookedSeats.includes(seatId)
        });
      }
    });
    return seats;
  };

  const [seats] = useState(generateSeats());

  // Get selected route object
  const getSelectedRouteObject = () => {
    return routesData.find(r => r.id === parseInt(selectedRoute));
  };

  // Calculate fare based on distance between stops
  useEffect(() => {
    if (sourceStop && destinationStop && selectedRoute) {
      const route = getSelectedRouteObject();
      if (route) {
        const sourceIndex = route.stops.findIndex(s => s.id === parseInt(sourceStop));
        const destIndex = route.stops.findIndex(s => s.id === parseInt(destinationStop));
        
        if (sourceIndex !== -1 && destIndex !== -1 && destIndex > sourceIndex) {
          const distance = Math.abs(destIndex - sourceIndex);
          const calculatedFare = distance * 2.5;
          setFare(calculatedFare);
        } else {
          setFare(0);
        }
      }
    } else {
      setFare(0);
    }
  }, [sourceStop, destinationStop, selectedRoute]);

  // Handle route selection
  const handleRouteChange = (e) => {
    const routeId = e.target.value;
    setSelectedRoute(routeId);
    setSourceStop('');
    setDestinationStop('');
    setSelectedSeats([]);
    setFare(0);
  };

  // Handle source stop change
  const handleSourceChange = (e) => {
    const stopId = e.target.value;
    setSourceStop(stopId);
    setDestinationStop('');
    setSelectedSeats([]);
  };

  // Handle destination stop change
  const handleDestinationChange = (e) => {
    setDestinationStop(e.target.value);
  };

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Select seat (max 4 seats)
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert('You can select a maximum of 4 seats');
      }
    }
  };

  // Handle passenger details change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!selectedRoute) {
      newErrors.route = 'Please select a route';
    }
    if (!sourceStop) {
      newErrors.source = 'Please select source stop';
    }
    if (!destinationStop) {
      newErrors.destination = 'Please select destination stop';
    }
    if (selectedSeats.length === 0) {
      newErrors.seats = 'Please select at least one seat';
    }
    if (!passengerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!passengerDetails.age || parseInt(passengerDetails.age) < 1 || parseInt(passengerDetails.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!passengerDetails.gender) {
      newErrors.gender = 'Please select gender';
    }
    if (!passengerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(passengerDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!passengerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!validateForm()) {
      return;
    }

    const route = getSelectedRouteObject();
    const sourceStopObj = route.stops.find(s => s.id === parseInt(sourceStop));
    const destStopObj = route.stops.find(s => s.id === parseInt(destinationStop));

    const bookingData = {
      ticketID: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      route: route.name,
      source: sourceStopObj.name,
      destination: destStopObj.name,
      passengerName: passengerDetails.name,
      seatNumbers: selectedSeats.sort(),
      fare: fare.toFixed(2),
      timestamp: new Date().toISOString(),
      passengerDetails: { ...passengerDetails }
    };

    // Navigate to payment page with booking data
    navigate('/payment', { state: { booking: bookingData } });
  };

  const selectedRouteObj = getSelectedRouteObject();
  const availableStops = selectedRouteObj ? selectedRouteObj.stops : [];

  return (
    <div className="ticket-booking-page">
      <Navbar />
      <main className="booking-main">
        <div className="booking-container">
          {/* Header Section */}
          <div className="booking-header">
            <h1 className="booking-title">Book a Ticket</h1>
            <p className="booking-subtitle">Choose your route, stops, and seat</p>
          </div>

          {/* Route Selection */}
          <div className="booking-section">
            <h2 className="section-title">Select Route</h2>
            <div className="form-group">
              <label htmlFor="route">Route *</label>
              <select
                id="route"
                value={selectedRoute}
                onChange={handleRouteChange}
                className={`form-select ${errors.route ? 'error' : ''}`}
              >
                <option value="">-- Select a Route --</option>
                {routesData.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
              {errors.route && <span className="error-message">{errors.route}</span>}
            </div>
          </div>

          {/* Source & Destination Selection */}
          {selectedRoute && (
            <div className="booking-section">
              <h2 className="section-title">Select Stops</h2>
              <div className="stops-grid">
                <div className="form-group">
                  <label htmlFor="source">Source Stop *</label>
                  <select
                    id="source"
                    value={sourceStop}
                    onChange={handleSourceChange}
                    className={`form-select ${errors.source ? 'error' : ''}`}
                  >
                    <option value="">-- Select Source --</option>
                    {availableStops.map(stop => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                  {errors.source && <span className="error-message">{errors.source}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="destination">Destination Stop *</label>
                  <select
                    id="destination"
                    value={destinationStop}
                    onChange={handleDestinationChange}
                    disabled={!sourceStop}
                    className={`form-select ${errors.destination ? 'error' : ''}`}
                  >
                    <option value="">-- Select Destination --</option>
                    {availableStops
                      .filter(stop => {
                        if (!sourceStop) return false;
                        const sourceIndex = availableStops.findIndex(s => s.id === parseInt(sourceStop));
                        return stop.order > availableStops[sourceIndex].order;
                      })
                      .map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name}
                        </option>
                      ))}
                  </select>
                  {errors.destination && <span className="error-message">{errors.destination}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Seat Selection */}
          {sourceStop && destinationStop && (
            <div className="booking-section">
              <h2 className="section-title">Select Seats</h2>
              <p className="section-hint">Select up to 4 seats. Green = Available, Red = Booked, Blue = Selected</p>
              <div className="seat-grid">
                {seats.map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const seatClass = seat.isBooked
                    ? 'seat-booked'
                    : isSelected
                    ? 'seat-selected'
                    : 'seat-available';

                  return (
                    <button
                      key={seat.id}
                      className={`seat ${seatClass}`}
                      onClick={() => !seat.isBooked && handleSeatClick(seat.id)}
                      disabled={seat.isBooked}
                      title={seat.isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
              {errors.seats && <span className="error-message">{errors.seats}</span>}
              {selectedSeats.length > 0 && (
                <p className="selected-seats-info">
                  Selected Seats: {selectedSeats.sort().join(', ')} ({selectedSeats.length}/4)
                </p>
              )}
            </div>
          )}

          {/* Fare Display */}
          {fare > 0 && (
            <div className="fare-section">
              <div className="fare-card">
                <span className="fare-label">Total Fare:</span>
                <span className="fare-amount">₹{fare.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Passenger Details Form */}
          {selectedSeats.length > 0 && (
            <div className="booking-section">
              <h2 className="section-title">Passenger Details</h2>
              <div className="passenger-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={passengerDetails.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={passengerDetails.age}
                      onChange={handleInputChange}
                      className={`form-input ${errors.age ? 'error' : ''}`}
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                    {errors.age && <span className="error-message">{errors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={passengerDetails.gender}
                      onChange={handleInputChange}
                      className={`form-select ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={passengerDetails.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={passengerDetails.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Confirm Booking Button */}
          {selectedSeats.length > 0 && (
            <div className="booking-actions">
              <button
                className="confirm-booking-btn"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketBookingPage;

