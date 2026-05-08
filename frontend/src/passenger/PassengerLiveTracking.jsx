import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getLiveLocation, getETA } from '../services/api';
import { createVehicleMarker } from '../utils/leafletIcons';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import './PassengerLiveTracking.css';

const PassengerLiveTracking = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [currentETA, setCurrentETA] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

  // Dummy route data
  const routesData = [
    {
      id: 1,
      name: 'Route A - Downtown Express',
      firstStop: { lat: 31.6331, lng: 74.8723 }
    },
    {
      id: 2,
      name: 'Route B - North Loop',
      firstStop: { lat: 31.6500, lng: 74.8800 }
    },
    {
      id: 3,
      name: 'Route C - Coastal Line',
      firstStop: { lat: 31.6200, lng: 74.8600 }
    },
    {
      id: 4,
      name: 'Route D - Industrial Zone',
      firstStop: { lat: 31.6600, lng: 74.8900 }
    },
    {
      id: 5,
      name: 'Route E - Airport Shuttle',
      firstStop: { lat: 31.6700, lng: 74.9000 }
    },
    {
      id: 6,
      name: 'Route F - Suburban Connector',
      firstStop: { lat: 31.6800, lng: 74.9100 }
    }
  ];

  // Find route by ID
  useEffect(() => {
    const foundRoute = routesData.find(r => r.id === parseInt(id));
    if (foundRoute) {
      setRoute(foundRoute);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Fetch live location
  const fetchLiveLocation = async () => {
    try {
      setLocationLoading(true);
      const data = await getLiveLocation();
      setLiveLocation(data);

      // Calculate ETA to next stop (simulated distance)
      if (data) {
        const distance = 2000; // Simulated 2km to next stop
        try {
          const etaData = await getETA({ distance });
          const etaMinutes = etaData?.eta_in_seconds ? Math.round(etaData.eta_in_seconds / 60) : 0;
          setCurrentETA(etaMinutes);
        } catch (error) {
          console.error('Failed to fetch ETA:', error);
        }
      }
      setLocationLoading(false);
    } catch (error) {
      console.error('Failed to fetch live location:', error);
      setLocationLoading(false);
    }
  };

  // Fetch location immediately and then every 3 seconds to match backend simulation
  useEffect(() => {
    if (!route) return;

    fetchLiveLocation();
    const interval = setInterval(fetchLiveLocation, 3000);

    return () => clearInterval(interval);
  }, [route]);

  // Map configuration
  const getMapCenter = () => {
    if (liveLocation) {
      const lat = liveLocation.latitude || liveLocation.lat || 31.6331;
      const lng = liveLocation.longitude || liveLocation.lng || liveLocation.lon || 74.8723;
      return [lat, lng];
    }
    if (route) {
      return [route.firstStop.lat, route.firstStop.lng];
    }
    return [31.6331, 74.8723];
  };

  // Component to update map center when location changes
  function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [map, center, zoom]);
    return null;
  }

  if (loading) {
    return (
      <div className="passenger-live-tracking">

        <main className="passenger-main">
          <div className="loading-state">Loading live tracking...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="passenger-live-tracking">

        <main className="passenger-main">
          <div className="error-state">
            <h2>Route Not Found</h2>
            <p>The route you're looking for doesn't exist.</p>
            <Link to="/passenger/routes" className="back-link">← Back to Routes</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentLat = liveLocation?.latitude || liveLocation?.lat || 0;
  const currentLng = liveLocation?.longitude || liveLocation?.lng || liveLocation?.lon || 0;
  const currentSpeed = liveLocation?.speed || 0;

  return (
    <div className="passenger-live-tracking">

      <main className="passenger-main">
        <div className="passenger-container">
          {/* Header Section */}
          <div className="tracking-header">
            <Link to={`/passenger/route/${id}`} className="back-button">← Back to Route</Link>
            <h1 className="tracking-title">Live Tracking</h1>
            <p className="tracking-subtitle">{route.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3 className="stat-label">Vehicle Speed</h3>
                <p className="stat-value">
                  {locationLoading ? '...' : `${currentSpeed.toFixed(1)} km/h`}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3 className="stat-label">ETA to Next Stop</h3>
                <p className="stat-value">
                  {locationLoading ? '...' : `${currentETA} min`}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <h3 className="stat-label">Status</h3>
                <p className="stat-value">
                  {locationLoading ? 'Loading...' : 'Live'}
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-header">
              <h2 className="section-title">Live Vehicle Location</h2>
              <button onClick={fetchLiveLocation} className="refresh-button" disabled={locationLoading}>
                🔄 Refresh
              </button>
            </div>
            <div className="map-container">
              {liveLocation && currentLat !== 0 && currentLng !== 0 ? (
                <MapContainer
                  center={getMapCenter()}
                  zoom={15}
                  style={{ width: '100%', height: '500px', borderRadius: '12px' }}
                  scrollWheelZoom={true}
                >
                  <ChangeView center={getMapCenter()} zoom={15} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[currentLat, currentLng]}
                    icon={createVehicleMarker('🚗')}
                  >
                    <Popup>
                      <strong>Vehicle - {route.name}</strong><br />
                      Speed: {currentSpeed.toFixed(1)} km/h<br />
                      Lat: {currentLat.toFixed(6)}<br />
                      Lng: {currentLng.toFixed(6)}
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="map-placeholder">
                  <p>Waiting for vehicle location...</p>
                </div>
              )}
            </div>
            <p className="refresh-note">Location updates every 3 seconds</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PassengerLiveTracking;

