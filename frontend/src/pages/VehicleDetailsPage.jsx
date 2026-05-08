import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getLiveLocation } from '../services/api';
import { createVehicleMarker } from '../utils/leafletIcons';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import './VehicleDetailsPage.css';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [movementHistory, setMovementHistory] = useState([]);

  // Dummy dataset of vehicles
  const vehiclesData = [
    {
      id: 1,
      name: 'Vehicle 1',
      type: 'Bus',
      status: 'Active',
      assignedRoute: 'Route A - Downtown Express',
      description: 'Large capacity bus serving downtown express route.'
    },
    {
      id: 2,
      name: 'Vehicle 2',
      type: 'Car',
      status: 'On Route',
      assignedRoute: 'Route B - North Loop',
      description: 'Compact car for quick urban transportation.'
    },
    {
      id: 3,
      name: 'Vehicle 3',
      type: 'Auto',
      status: 'Active',
      assignedRoute: 'Route C - Coastal Line',
      description: 'Auto-rickshaw for coastal area routes.'
    },
    {
      id: 4,
      name: 'Vehicle 4',
      type: 'Bus',
      status: 'Inactive',
      assignedRoute: 'Route D - Industrial Zone',
      description: 'Heavy-duty bus for industrial zone transportation.'
    },
    {
      id: 5,
      name: 'Vehicle 5',
      type: 'Car',
      status: 'Active',
      assignedRoute: 'Route E - Airport Shuttle',
      description: 'Premium car for airport shuttle service.'
    },
    {
      id: 6,
      name: 'Vehicle 6',
      type: 'Auto',
      status: 'On Route',
      assignedRoute: 'Route F - Suburban Connector',
      description: 'Auto-rickshaw connecting suburban areas.'
    },
    {
      id: 7,
      name: 'Vehicle 7',
      type: 'Bus',
      status: 'Active',
      assignedRoute: 'Route A - Downtown Express',
      description: 'Express bus for downtown route.'
    },
    {
      id: 8,
      name: 'Vehicle 8',
      type: 'Car',
      status: 'Inactive',
      assignedRoute: 'Route B - North Loop',
      description: 'Standard car for north loop route.'
    },
    {
      id: 9,
      name: 'Vehicle 9',
      type: 'Bus',
      status: 'On Route',
      assignedRoute: 'Route C - Coastal Line',
      description: 'Tourist bus for coastal scenic route.'
    }
  ];

  // Find vehicle by ID
  useEffect(() => {
    const foundVehicle = vehiclesData.find(v => v.id === parseInt(id));
    if (foundVehicle) {
      setVehicle(foundVehicle);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Fetch live location data
  const fetchLiveLocation = async () => {
    if (!vehicle) return;
    try {
      setLocationLoading(true);
      const data = await getLiveLocation(vehicle.id);
      setLiveLocation(data);

      // Add to movement history
      if (data) {
        const historyEntry = {
          time: new Date().toLocaleTimeString(),
          lat: data.latitude || data.lat || 0,
          lng: data.longitude || data.lng || data.lon || 0,
          speed: data.speed || 0
        };
        setMovementHistory(prev => {
          const updated = [historyEntry, ...prev];
          return updated.slice(0, 5); // Keep only last 5 entries
        });
      }
      setLocationLoading(false);
    } catch (error) {
      console.error('Failed to fetch live location:', error);
      setLocationLoading(false);
    }
  };

  // Fetch location immediately and then every 3 seconds to match backend simulation
  useEffect(() => {
    if (!vehicle) return;

    fetchLiveLocation();
    const interval = setInterval(fetchLiveLocation, 3000);

    return () => clearInterval(interval);
  }, [vehicle]);

  // Map configuration
  const getMapCenter = () => {
    if (liveLocation) {
      const lat = liveLocation.latitude || liveLocation.lat || 31.6331;
      const lng = liveLocation.longitude || liveLocation.lng || liveLocation.lon || 74.8723;
      return [lat, lng];
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

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('active')) {
      return '#2e7d32'; // Green
    } else if (statusLower.includes('inactive')) {
      return '#757575'; // Grey
    } else if (statusLower.includes('route')) {
      return '#ff9800'; // Orange/Yellow
    }
    return '#666';
  };

  const getStatusBgColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('active')) {
      return '#c8e6c9'; // Light green
    } else if (statusLower.includes('inactive')) {
      return '#e0e0e0'; // Light grey
    } else if (statusLower.includes('route')) {
      return '#fff3e0'; // Light orange
    }
    return '#f5f5f5';
  };


  if (loading) {
    return (
      <div className="vehicle-details-page">
        <Navbar />
        <main className="vehicle-details-main">
          <div className="loading-state">Loading vehicle details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-details-page">
        <Navbar />
        <main className="vehicle-details-main">
          <div className="error-state">
            <h2>Vehicle Not Found</h2>
            <p>The vehicle you're looking for doesn't exist.</p>
            <Link to="/vehicles" className="back-link">← Back to Vehicles</Link>
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
    <div className="vehicle-details-page">
      <Navbar />
      <main className="vehicle-details-main">
        <div className="vehicle-details-container">
          {/* Header Section */}
          <div className="vehicle-header">
            <Link to="/vehicles" className="back-button">← Back to Vehicles</Link>
            <div className="header-content">
              <div className="header-text">
                <h1 className="vehicle-title">{vehicle.name}</h1>
                <p className="vehicle-subtitle">{vehicle.type}</p>
                <p className="vehicle-description">{vehicle.description}</p>
              </div>
              <div className="status-badge-large" style={{
                backgroundColor: getStatusBgColor(vehicle.status),
                color: getStatusColor(vehicle.status),
                borderColor: getStatusColor(vehicle.status)
              }}>
                {vehicle.status}
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="card-icon">🚗</div>
              <div className="card-content">
                <h3 className="card-value">{vehicle.type}</h3>
                <p className="card-label">Vehicle Type</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">🗺️</div>
              <div className="card-content">
                <h3 className="card-value">{vehicle.assignedRoute}</h3>
                <p className="card-label">Assigned Route</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3 className="card-value">{vehicle.status}</h3>
                <p className="card-label">Current Status</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <h3 className="card-value">
                  {locationLoading ? '...' : `${currentSpeed.toFixed(1)} km/h`}
                </h3>
                <p className="card-label">Last Known Speed</p>
              </div>
            </div>
          </div>

          {/* Live Mini Map */}
          <div className="map-section">
            <h2 className="section-title">Live Location</h2>
            <div className="map-container">
              {liveLocation && currentLat !== 0 && currentLng !== 0 ? (
                <MapContainer
                  center={getMapCenter()}
                  zoom={15}
                  style={{ width: '100%', height: '300px', borderRadius: '12px' }}
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
                      <strong>{vehicle.name} - {vehicle.type}</strong><br />
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
          </div>

          {/* Timestamp Section */}
          {liveLocation && (
            <div className="timestamp-section">
              <div className="timestamp-card">
                <div className="timestamp-icon">🕐</div>
                <div className="timestamp-content">
                  <h3 className="timestamp-label">Last Updated</h3>
                  <p className="timestamp-value">
                    {formatTimestamp(liveLocation.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Movement History Table */}
          {movementHistory.length > 0 && (
            <div className="history-section">
              <h2 className="section-title">Movement History</h2>
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movementHistory.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.time}</td>
                        <td>{entry.lat.toFixed(6)}</td>
                        <td>{entry.lng.toFixed(6)}</td>
                        <td>{entry.speed.toFixed(1)} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetailsPage;

