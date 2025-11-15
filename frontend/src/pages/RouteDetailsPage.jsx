import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { getETA } from '../services/api';
import { createNumberedMarker } from '../utils/leafletIcons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import './RouteDetailsPage.css';

const RouteDetailsPage = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [etas, setEtas] = useState({});
  const [loading, setLoading] = useState(true);

  // Dummy dataset of routes
  const routesData = [
    {
      id: 1,
      name: 'Route A - Downtown Express',
      description: 'Fast express route connecting downtown areas with major business districts.',
      stops: [
        { id: 1, name: 'Central Station', lat: 31.6331, lng: 74.8723, order: 1 },
        { id: 2, name: 'Main Square', lat: 31.6360, lng: 74.8742, order: 2 },
        { id: 3, name: 'City Hall', lat: 31.6380, lng: 74.8751, order: 3 },
        { id: 4, name: 'Shopping District', lat: 31.6400, lng: 74.8767, order: 4 },
        { id: 5, name: 'Park Avenue', lat: 31.6420, lng: 74.8780, order: 5 }
      ],
      totalDistance: 8500, // meters
      approxTime: 25 // minutes
    },
    {
      id: 2,
      name: 'Route B - North Loop',
      description: 'Scenic route through northern residential and university areas.',
      stops: [
        { id: 6, name: 'North Terminal', lat: 31.6500, lng: 74.8800, order: 1 },
        { id: 7, name: 'University Campus', lat: 31.6520, lng: 74.8820, order: 2 },
        { id: 11, name: 'Sports Complex', lat: 31.6540, lng: 74.8840, order: 3 },
        { id: 12, name: 'Residential Area', lat: 31.6560, lng: 74.8860, order: 4 }
      ],
      totalDistance: 6200,
      approxTime: 18
    },
    {
      id: 3,
      name: 'Route C - Coastal Line',
      description: 'Beautiful coastal route with harbor and beach views.',
      stops: [
        { id: 8, name: 'Beach Station', lat: 31.6200, lng: 74.8600, order: 1 },
        { id: 13, name: 'Marina', lat: 31.6220, lng: 74.8620, order: 2 },
        { id: 14, name: 'Harbor View', lat: 31.6240, lng: 74.8640, order: 3 },
        { id: 15, name: 'Lighthouse Point', lat: 31.6260, lng: 74.8660, order: 4 }
      ],
      totalDistance: 4800,
      approxTime: 15
    },
    {
      id: 4,
      name: 'Route D - Industrial Zone',
      description: 'Efficient route connecting industrial and logistics centers.',
      stops: [
        { id: 16, name: 'Factory District', lat: 31.6600, lng: 74.8900, order: 1 },
        { id: 17, name: 'Warehouse Area', lat: 31.6620, lng: 74.8920, order: 2 },
        { id: 18, name: 'Logistics Center', lat: 31.6640, lng: 74.8940, order: 3 },
        { id: 19, name: 'Distribution Hub', lat: 31.6660, lng: 74.8960, order: 4 }
      ],
      totalDistance: 7200,
      approxTime: 22
    },
    {
      id: 5,
      name: 'Route E - Airport Shuttle',
      description: 'Direct connection from airport to downtown and hotels.',
      stops: [
        { id: 9, name: 'Airport Terminal', lat: 31.6700, lng: 74.9000, order: 1 },
        { id: 20, name: 'Hotel District', lat: 31.6400, lng: 74.8760, order: 2 },
        { id: 21, name: 'Convention Center', lat: 31.6380, lng: 74.8750, order: 3 },
        { id: 22, name: 'Downtown', lat: 31.6360, lng: 74.8740, order: 4 }
      ],
      totalDistance: 12000,
      approxTime: 35
    },
    {
      id: 6,
      name: 'Route F - Suburban Connector',
      description: 'Comprehensive route linking suburban areas with city center.',
      stops: [
        { id: 10, name: 'Suburban Station', lat: 31.6800, lng: 74.9100, order: 1 },
        { id: 23, name: 'Green Park', lat: 31.6750, lng: 74.9050, order: 2 },
        { id: 24, name: 'Community Center', lat: 31.6700, lng: 74.9000, order: 3 },
        { id: 25, name: 'School District', lat: 31.6650, lng: 74.8950, order: 4 },
        { id: 26, name: 'Residential Complex', lat: 31.6600, lng: 74.8900, order: 5 }
      ],
      totalDistance: 9500,
      approxTime: 28
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

  // Fetch ETAs for each stop segment
  useEffect(() => {
    if (!route || route.stops.length < 2) return;

    const fetchETAs = async () => {
      const newEtas = {};
      for (let i = 0; i < route.stops.length - 1; i++) {
        try {
          // Calculate approximate distance between stops (simplified)
          const distance = route.totalDistance / (route.stops.length - 1);
          const data = await getETA({ distance: Math.round(distance) });
          const etaMinutes = data?.eta_in_seconds ? Math.round(data.eta_in_seconds / 60) : 0;
          newEtas[`${i}-${i + 1}`] = etaMinutes;
        } catch (error) {
          console.error(`Failed to fetch ETA for segment ${i}:`, error);
          newEtas[`${i}-${i + 1}`] = 0;
        }
      }
      setEtas(newEtas);
    };

    fetchETAs();
  }, [route]);

  // Calculate map center
  const getMapCenter = () => {
    if (!route || route.stops.length === 0) {
      return [31.6331, 74.8723];
    }
    const avgLat = route.stops.reduce((sum, stop) => sum + stop.lat, 0) / route.stops.length;
    const avgLng = route.stops.reduce((sum, stop) => sum + stop.lng, 0) / route.stops.length;
    return [avgLat, avgLng];
  };

  // Get polyline path for Leaflet (array of [lat, lng] arrays)
  const getPolylinePath = () => {
    if (!route) return [];
    return route.stops.map(stop => [stop.lat, stop.lng]);
  };

  // Component to fit map bounds
  function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [map, bounds]);
    return null;
  }

  if (loading) {
    return (
      <div className="route-details-page">
        <Navbar />
        <main className="route-details-main">
          <div className="loading-state">Loading route details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="route-details-page">
        <Navbar />
        <main className="route-details-main">
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

  return (
    <div className="route-details-page">
      <Navbar />
      <main className="route-details-main">
        <div className="route-details-container">
          {/* Title Section */}
          <div className="route-header">
            <Link to="/routes" className="back-button">← Back to Routes</Link>
            <div className="header-actions">
              <h1 className="route-title">{route.name}</h1>
              <Link to={`/route-playback/${route.id}`} className="playback-button">
                ▶ Play Route Animation
              </Link>
            </div>
            <p className="route-description">{route.description}</p>
          </div>

          {/* Route Info Cards */}
          <div className="route-info-cards">
            <div className="info-card">
              <div className="card-icon">📏</div>
              <div className="card-content">
                <h3 className="card-value">{(route.totalDistance / 1000).toFixed(1)} km</h3>
                <p className="card-label">Total Distance</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">⏱️</div>
              <div className="card-content">
                <h3 className="card-value">{route.approxTime} min</h3>
                <p className="card-label">Estimated Time</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">📍</div>
              <div className="card-content">
                <h3 className="card-value">{route.stops.length}</h3>
                <p className="card-label">Total Stops</p>
              </div>
            </div>
          </div>

          <div className="route-content">
            {/* Stops Timeline */}
            <div className="stops-section">
              <h2 className="section-title">Route Stops</h2>
              <div className="timeline">
                {route.stops.map((stop, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="stop-number">{stop.order}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="stop-name-container">
                        <h3 className="stop-name">{stop.name}</h3>
                        {stop.id && (
                          <Link to={`/stop/${stop.id}`} className="view-stop-link">
                            View Stop Details →
                          </Link>
                        )}
                      </div>
                      {index < route.stops.length - 1 && (
                        <div className="eta-badge">
                          ETA: {etas[`${index}-${index + 1}`] || '...'} min
                        </div>
                      )}
                    </div>
                    {index < route.stops.length - 1 && (
                      <div className="timeline-connector">
                        <div className="connector-line"></div>
                        <div className="connector-arrow">↓</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Map */}
            <div className="map-section">
              <h2 className="section-title">Route Map</h2>
              <div className="map-container">
                {route && route.stops.length > 0 ? (
                  <MapContainer
                    center={getMapCenter()}
                    zoom={12}
                    style={{ width: '100%', height: '300px', borderRadius: '12px' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBounds bounds={getPolylinePath()} />
                    <Polyline
                      positions={getPolylinePath()}
                      pathOptions={{ color: '#2e7d32', weight: 4, opacity: 0.8 }}
                    />
                    {route.stops.map((stop, index) => (
                      <Marker
                        key={stop.id}
                        position={[stop.lat, stop.lng]}
                        icon={createNumberedMarker(index + 1, '#2e7d32')}
                      >
                        <Popup>
                          <strong>Stop {index + 1}</strong><br />
                          {stop.name}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="map-placeholder">
                    <p>Loading map...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RouteDetailsPage;

