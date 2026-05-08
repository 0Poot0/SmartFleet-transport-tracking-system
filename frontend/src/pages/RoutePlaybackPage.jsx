import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { getETA } from '../services/api';
import { createVehicleMarker } from '../utils/leafletIcons';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import './RoutePlaybackPage.css';

const RoutePlaybackPage = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x, 4x
  const [currentETA, setCurrentETA] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Dummy dataset of routes with coordinates
  const routesData = [
    {
      id: 1,
      name: 'Route A - Downtown Express',
      coordinates: [
        { lat: 31.6331, lng: 74.8723 },
        { lat: 31.6360, lng: 74.8742 },
        { lat: 31.6380, lng: 74.8751 },
        { lat: 31.6400, lng: 74.8767 },
        { lat: 31.6420, lng: 74.8780 }
      ],
      totalDistance: 8500 // meters
    },
    {
      id: 2,
      name: 'Route B - North Loop',
      coordinates: [
        { lat: 31.6500, lng: 74.8800 },
        { lat: 31.6520, lng: 74.8820 },
        { lat: 31.6540, lng: 74.8840 },
        { lat: 31.6560, lng: 74.8860 }
      ],
      totalDistance: 6200
    },
    {
      id: 3,
      name: 'Route C - Coastal Line',
      coordinates: [
        { lat: 31.6200, lng: 74.8600 },
        { lat: 31.6220, lng: 74.8620 },
        { lat: 31.6240, lng: 74.8640 },
        { lat: 31.6260, lng: 74.8660 }
      ],
      totalDistance: 4800
    },
    {
      id: 4,
      name: 'Route D - Industrial Zone',
      coordinates: [
        { lat: 31.6600, lng: 74.8900 },
        { lat: 31.6620, lng: 74.8920 },
        { lat: 31.6640, lng: 74.8940 },
        { lat: 31.6660, lng: 74.8960 }
      ],
      totalDistance: 7200
    },
    {
      id: 5,
      name: 'Route E - Airport Shuttle',
      coordinates: [
        { lat: 31.6700, lng: 74.9000 },
        { lat: 31.6400, lng: 74.8760 },
        { lat: 31.6380, lng: 74.8750 },
        { lat: 31.6360, lng: 74.8740 }
      ],
      totalDistance: 12000
    },
    {
      id: 6,
      name: 'Route F - Suburban Connector',
      coordinates: [
        { lat: 31.6800, lng: 74.9100 },
        { lat: 31.6750, lng: 74.9050 },
        { lat: 31.6700, lng: 74.9000 },
        { lat: 31.6650, lng: 74.8950 },
        { lat: 31.6600, lng: 74.8900 }
      ],
      totalDistance: 9500
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

  // Calculate remaining distance from current point to end
  const calculateRemainingDistance = (currentIndex) => {
    if (!route || currentIndex >= route.coordinates.length - 1) return 0;
    
    // Simple calculation: proportional distance based on remaining points
    const remainingPoints = route.coordinates.length - currentIndex - 1;
    const totalPoints = route.coordinates.length - 1;
    return Math.round((remainingPoints / totalPoints) * route.totalDistance);
  };

  // Fetch ETA for current position
  useEffect(() => {
    if (!route || currentPointIndex >= route.coordinates.length - 1) {
      setCurrentETA(0);
      return;
    }

    const fetchETA = async () => {
      try {
        const remainingDistance = calculateRemainingDistance(currentPointIndex);
        const data = await getETA({ distance: remainingDistance });
        const etaMinutes = data?.eta_in_seconds ? Math.round(data.eta_in_seconds / 60) : 0;
        setCurrentETA(etaMinutes);
      } catch (error) {
        console.error('Failed to fetch ETA:', error);
        setCurrentETA(0);
      }
    };

    fetchETA();
  }, [route, currentPointIndex]);

  // Animation control
  useEffect(() => {
    if (isPlaying && route) {
      const baseInterval = 1000; // 1 second base interval
      const interval = baseInterval / playbackSpeed;

      intervalRef.current = setInterval(() => {
        setCurrentPointIndex((prevIndex) => {
          if (prevIndex >= route.coordinates.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, playbackSpeed, route]);

  // Map configuration
  const getMapCenter = () => {
    if (!route || route.coordinates.length === 0) {
      return [31.6331, 74.8723];
    }
    const avgLat = route.coordinates.reduce((sum, coord) => sum + coord.lat, 0) / route.coordinates.length;
    const avgLng = route.coordinates.reduce((sum, coord) => sum + coord.lng, 0) / route.coordinates.length;
    return [avgLat, avgLng];
  };

  // Get polyline path for Leaflet
  const getPolylinePath = () => {
    if (!route) return [];
    return route.coordinates.map(coord => [coord.lat, coord.lng]);
  };

  // Component to fit map bounds and update center
  function MapController({ bounds, center, zoom }) {
    const map = useMap();
    useEffect(() => {
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [map, bounds]);
    useEffect(() => {
      if (center && center.length === 2) {
        map.setView(center, zoom || map.getZoom());
      }
    }, [map, center, zoom]);
    return null;
  }

  const handlePlay = () => {
    if (currentPointIndex >= route.coordinates.length - 1) {
      setCurrentPointIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentPointIndex(0);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const getCurrentPosition = () => {
    if (!route || !route.coordinates[currentPointIndex]) {
      return [0, 0];
    }
    const coord = route.coordinates[currentPointIndex];
    return [coord.lat, coord.lng];
  };

  const progress = route
    ? (currentPointIndex / (route.coordinates.length - 1)) * 100
    : 0;

  if (loading) {
    return (
      <div className="route-playback-page">
        <Navbar />
        <main className="route-playback-main">
          <div className="loading-state">Loading route playback...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="route-playback-page">
        <Navbar />
        <main className="route-playback-main">
          <div className="error-state">
            <h2>Route Not Found</h2>
            <p>The route you're looking for doesn't exist.</p>
            <Link to="/routes" className="back-link">← Back to Routes</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPos = getCurrentPosition();
  const currentPosArray = Array.isArray(currentPos) ? currentPos : [currentPos.lat || 0, currentPos.lng || 0];

  return (
    <div className="route-playback-page">
      <Navbar />
      <main className="route-playback-main">
        <div className="route-playback-container">
          {/* Header Section */}
          <div className="playback-header">
            <Link to={`/route/${id}`} className="back-button">← Back to Route Details</Link>
            <h1 className="playback-title">Route Playback</h1>
            <p className="playback-subtitle">Simulated vehicle movement along this route</p>
            <p className="route-name">{route.name}</p>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              {route && route.coordinates.length > 0 ? (
                <MapContainer
                  center={getMapCenter()}
                  zoom={13}
                  style={{ width: '100%', height: '500px', borderRadius: '12px' }}
                  scrollWheelZoom={true}
                >
                  <MapController 
                    bounds={getPolylinePath()} 
                    center={currentPosArray}
                    zoom={15}
                  />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={getPolylinePath()}
                    pathOptions={{ color: '#2e7d32', weight: 4, opacity: 0.8 }}
                  />
                  {route.coordinates[currentPointIndex] && (
                    <Marker
                      position={currentPosArray}
                      icon={createVehicleMarker('🚗')}
                    >
                      <Popup>
                        <strong>Vehicle Position</strong><br />
                        Point {currentPointIndex + 1} / {route.coordinates.length}<br />
                        Lat: {currentPosArray[0].toFixed(6)}<br />
                        Lng: {currentPosArray[1].toFixed(6)}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">
              {Math.round(progress)}% Complete ({currentPointIndex + 1} / {route.coordinates.length})
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="playback-controls">
              <button
                className="control-btn play-btn"
                onClick={handlePlay}
                disabled={isPlaying}
              >
                ▶ Play
              </button>
              <button
                className="control-btn pause-btn"
                onClick={handlePause}
                disabled={!isPlaying}
              >
                ⏸ Pause
              </button>
              <button
                className="control-btn restart-btn"
                onClick={handleRestart}
              >
                ⏮ Restart
              </button>
            </div>
            <div className="speed-controls">
              <label>Speed:</label>
              <div className="speed-buttons">
                <button
                  className={`speed-btn ${playbackSpeed === 0.5 ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(0.5)}
                >
                  0.5x
                </button>
                <button
                  className={`speed-btn ${playbackSpeed === 1 ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(1)}
                >
                  1x
                </button>
                <button
                  className={`speed-btn ${playbackSpeed === 2 ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(2)}
                >
                  2x
                </button>
                <button
                  className={`speed-btn ${playbackSpeed === 4 ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(4)}
                >
                  4x
                </button>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="stats-panel">
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <h3 className="stat-label">Current Location</h3>
                <p className="stat-value">
                  {currentPos.lat.toFixed(6)}, {currentPos.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3 className="stat-label">Playback Speed</h3>
                <p className="stat-value">{playbackSpeed}x</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <h3 className="stat-label">Route Distance</h3>
                <p className="stat-value">{(route.totalDistance / 1000).toFixed(2)} km</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3 className="stat-label">Estimated Arrival Time</h3>
                <p className="stat-value">{currentETA} min</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-label">Progress</h3>
                <p className="stat-value">
                  {currentPointIndex + 1} / {route.coordinates.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoutePlaybackPage;

