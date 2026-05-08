import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import LiveMap from '../components/LiveMap';
import { getLiveLocation, getETA } from '../services/api';
import './LiveTrackingPage.css';

const LiveTrackingPage = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eta, setEta] = useState(null);
  const [etaLoading, setEtaLoading] = useState(false);

  const fetchLocation = async () => {
    try {
      setError(null);
      const data = await getLiveLocation();
      setLocation(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch live location');
      setLoading(false);
    }
  };

  const fetchETA = async () => {
    try {
      setEtaLoading(true);
      // Using a sample fixed distance of 1200 meters
      const data = await getETA({ distance: 1200 });
      setEta(data);
      setEtaLoading(false);
    } catch (err) {
      console.error('Failed to fetch ETA:', err);
      setEtaLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchLocation();
    fetchETA();

    // Then fetch every 3 seconds to match backend simulation
    const interval = setInterval(() => {
      fetchLocation();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const lat = location?.latitude || location?.lat || 0;
  const lng = location?.longitude || location?.lng || location?.lon || 0;
  const speed = location?.speed || 0;
  const timestamp = location?.timestamp || new Date().toISOString();

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  const formatETA = (etaData) => {
    if (!etaData) return 'Calculating...';
    if (etaData.eta_in_seconds !== undefined) {
      const minutes = Math.round(etaData.eta_in_seconds / 60);
      return `${minutes} minutes`;
    }
    if (etaData.etaMinutes !== undefined) {
      return `${Math.round(etaData.etaMinutes)} minutes`;
    }
    if (etaData.eta !== undefined) {
      return `${Math.round(etaData.eta)} minutes`;
    }
    return 'N/A';
  };

  return (
    <div className="live-tracking-page">
      <main className="live-tracking-main">
        <div className="live-tracking-container">
          
          <div className="live-tracking-header">
            <h1 className="live-tracking-title">🚌 Live Vehicle Tracking</h1>
          </div>

          <div className="live-tracking-controls">
            <div className="vehicle-selector">
              <label htmlFor="vehicle-select" className="vehicle-select-label">Select Vehicle:</label>
              <select id="vehicle-select" className="vehicle-dropdown">
                <option value="bus1">Bus 001</option>
                <option value="bus2">Bus 002</option>
                <option value="car1">Car 001</option>
              </select>
            </div>
            <button onClick={fetchLocation} className="refresh-button">
              🔄 Refresh
            </button>
          </div>

          {loading && !location ? (
            <div className="loading-state">Loading location data...</div>
          ) : error && !location ? (
            <div className="error-state">
              <p>Error: {error}</p>
              <button onClick={fetchLocation} className="retry-button">Retry</button>
            </div>
          ) : (
            <>
              <div className="map-wrapper">
                <LiveMap 
                  lat={lat} 
                  lng={lng} 
                  vehicleName={location?.vehicleName || 'Vehicle'} 
                />
              </div>

              <div className="vehicle-info-grid">
                <div className="grid-card">
                  <div className="icon">🟢</div>
                  <div className="label">Vehicle Status</div>
                  <div className="value"><span className="status-active">ACTIVE</span></div>
                </div>

                <div className="grid-card">
                  <div className="icon">⚡</div>
                  <div className="label">Speed</div>
                  <div className="value">{speed.toFixed(1)} km/h</div>
                </div>

                <div className="grid-card">
                  <div className="icon">🕐</div>
                  <div className="label">Last Updated</div>
                  <div className="value timestamp-value">{formatTimestamp(timestamp)}</div>
                </div>

                <div className="grid-card eta-card">
                  <div className="icon">⏱️</div>
                  <div className="label">Estimated Arrival</div>
                  <div className="value">{etaLoading ? 'Calculating...' : formatETA(eta)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveTrackingPage;

