import React, { useState, useEffect } from 'react';
import { getLiveLocation } from '../services/api';
import MapView from './MapView';

const LiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    // Fetch immediately
    fetchLocation();

    // Then fetch every 5 seconds
    const interval = setInterval(() => {
      fetchLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !location) {
    return (
      <div className="container">
        <h2>Live Location</h2>
        <div className="loading">Loading location data...</div>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="container">
        <h2>Live Location</h2>
        <div className="error">Error: {error}</div>
        <button onClick={fetchLocation}>Retry</button>
      </div>
    );
  }

  const lat = location?.latitude || location?.lat || 0;
  const lng = location?.longitude || location?.lng || location?.lon || 0;

  return (
    <div className="container">
      <h2>Live Location</h2>
      {error && <div className="error">Warning: {error}</div>}
      <div className="location-info">
        <p><strong>Latitude:</strong> {lat.toFixed(6)}</p>
        <p><strong>Longitude:</strong> {lng.toFixed(6)}</p>
        {location?.timestamp && (
          <p><strong>Last Updated:</strong> {new Date(location.timestamp).toLocaleString()}</p>
        )}
      </div>
      <div className="map-container">
        <MapView lat={lat} lng={lng} vehicleName={location?.vehicleName || 'Vehicle'} />
      </div>
    </div>
  );
};

export default LiveLocation;

