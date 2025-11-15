import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getETA } from '../services/api';
import { stopIcon } from '../utils/leafletIcons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import './StopDetailsPage.css';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const StopDetailsPage = () => {
  const { id } = useParams();
  const [stop, setStop] = useState(null);
  const [nearbyVehicles, setNearbyVehicles] = useState([]);
  const [vehicleEtas, setVehicleEtas] = useState({});
  const [loading, setLoading] = useState(true);

  // Dummy dataset of stops
  const stopsData = [
    {
      id: 1,
      name: 'Central Station',
      description: 'Main transportation hub connecting all major routes',
      lat: 31.6331,
      lng: 74.8723,
      routesPassing: ['Route A - Downtown Express', 'Route E - Airport Shuttle'],
      landmark: 'Central Plaza',
      zone: 'Downtown',
      image: null
    },
    {
      id: 2,
      name: 'Main Square',
      description: 'Historic square in the heart of the city',
      lat: 31.6360,
      lng: 74.8742,
      routesPassing: ['Route A - Downtown Express'],
      landmark: 'City Monument',
      zone: 'Downtown',
      image: null
    },
    {
      id: 3,
      name: 'City Hall',
      description: 'Government building and administrative center',
      lat: 31.6380,
      lng: 74.8751,
      routesPassing: ['Route A - Downtown Express'],
      landmark: 'City Hall Building',
      zone: 'Downtown',
      image: null
    },
    {
      id: 4,
      name: 'Shopping District',
      description: 'Bustling commercial area with shops and restaurants',
      lat: 31.6400,
      lng: 74.8767,
      routesPassing: ['Route A - Downtown Express'],
      landmark: 'Mall Complex',
      zone: 'Commercial',
      image: null
    },
    {
      id: 5,
      name: 'Park Avenue',
      description: 'Scenic avenue with parks and recreational facilities',
      lat: 31.6420,
      lng: 74.8780,
      routesPassing: ['Route A - Downtown Express'],
      landmark: 'Central Park',
      zone: 'Residential',
      image: null
    },
    {
      id: 6,
      name: 'North Terminal',
      description: 'Northern terminal connecting to suburban areas',
      lat: 31.6500,
      lng: 74.8800,
      routesPassing: ['Route B - North Loop', 'Route F - Suburban Connector'],
      landmark: 'North Station',
      zone: 'North',
      image: null
    },
    {
      id: 7,
      name: 'University Campus',
      description: 'Main campus stop serving students and faculty',
      lat: 31.6520,
      lng: 74.8820,
      routesPassing: ['Route B - North Loop'],
      landmark: 'University Main Gate',
      zone: 'North',
      image: null
    },
    {
      id: 8,
      name: 'Beach Station',
      description: 'Coastal stop with beach access',
      lat: 31.6200,
      lng: 74.8600,
      routesPassing: ['Route C - Coastal Line'],
      landmark: 'Beach Promenade',
      zone: 'Coastal',
      image: null
    },
    {
      id: 9,
      name: 'Airport Terminal',
      description: 'Main airport terminal for travelers',
      lat: 31.6700,
      lng: 74.9000,
      routesPassing: ['Route E - Airport Shuttle'],
      landmark: 'Airport Main Terminal',
      zone: 'Airport',
      image: null
    },
    {
      id: 10,
      name: 'Suburban Station',
      description: 'Connecting point for suburban commuters',
      lat: 31.6800,
      lng: 74.9100,
      routesPassing: ['Route F - Suburban Connector'],
      landmark: 'Suburban Hub',
      zone: 'Suburban',
      image: null
    },
    {
      id: 11,
      name: 'Sports Complex',
      description: 'Sports and recreation facility',
      lat: 31.6540,
      lng: 74.8840,
      routesPassing: ['Route B - North Loop'],
      landmark: 'Sports Arena',
      zone: 'North',
      image: null
    },
    {
      id: 12,
      name: 'Residential Area',
      description: 'Residential neighborhood stop',
      lat: 31.6560,
      lng: 74.8860,
      routesPassing: ['Route B - North Loop'],
      landmark: 'Residential Complex',
      zone: 'North',
      image: null
    },
    {
      id: 13,
      name: 'Marina',
      description: 'Harbor marina with boat access',
      lat: 31.6220,
      lng: 74.8620,
      routesPassing: ['Route C - Coastal Line'],
      landmark: 'Marina Bay',
      zone: 'Coastal',
      image: null
    },
    {
      id: 14,
      name: 'Harbor View',
      description: 'Scenic harbor viewpoint',
      lat: 31.6240,
      lng: 74.8640,
      routesPassing: ['Route C - Coastal Line'],
      landmark: 'Harbor Point',
      zone: 'Coastal',
      image: null
    },
    {
      id: 15,
      name: 'Lighthouse Point',
      description: 'Historic lighthouse location',
      lat: 31.6260,
      lng: 74.8660,
      routesPassing: ['Route C - Coastal Line'],
      landmark: 'Lighthouse',
      zone: 'Coastal',
      image: null
    },
    {
      id: 16,
      name: 'Factory District',
      description: 'Industrial factory area',
      lat: 31.6600,
      lng: 74.8900,
      routesPassing: ['Route D - Industrial Zone'],
      landmark: 'Factory Complex',
      zone: 'Industrial',
      image: null
    },
    {
      id: 17,
      name: 'Warehouse Area',
      description: 'Storage and warehouse district',
      lat: 31.6620,
      lng: 74.8920,
      routesPassing: ['Route D - Industrial Zone'],
      landmark: 'Warehouse Complex',
      zone: 'Industrial',
      image: null
    },
    {
      id: 18,
      name: 'Logistics Center',
      description: 'Main logistics and distribution hub',
      lat: 31.6640,
      lng: 74.8940,
      routesPassing: ['Route D - Industrial Zone'],
      landmark: 'Logistics Hub',
      zone: 'Industrial',
      image: null
    },
    {
      id: 19,
      name: 'Distribution Hub',
      description: 'Central distribution facility',
      lat: 31.6660,
      lng: 74.8960,
      routesPassing: ['Route D - Industrial Zone'],
      landmark: 'Distribution Center',
      zone: 'Industrial',
      image: null
    },
    {
      id: 20,
      name: 'Hotel District',
      description: 'Area with multiple hotels and accommodations',
      lat: 31.6400,
      lng: 74.8760,
      routesPassing: ['Route E - Airport Shuttle'],
      landmark: 'Grand Hotel',
      zone: 'Downtown',
      image: null
    },
    {
      id: 21,
      name: 'Convention Center',
      description: 'Large convention and event facility',
      lat: 31.6380,
      lng: 74.8750,
      routesPassing: ['Route E - Airport Shuttle'],
      landmark: 'Convention Hall',
      zone: 'Downtown',
      image: null
    },
    {
      id: 22,
      name: 'Downtown',
      description: 'Central downtown area',
      lat: 31.6360,
      lng: 74.8740,
      routesPassing: ['Route E - Airport Shuttle'],
      landmark: 'City Center',
      zone: 'Downtown',
      image: null
    },
    {
      id: 23,
      name: 'Green Park',
      description: 'Large public park and green space',
      lat: 31.6750,
      lng: 74.9050,
      routesPassing: ['Route F - Suburban Connector'],
      landmark: 'Green Park',
      zone: 'Suburban',
      image: null
    },
    {
      id: 24,
      name: 'Community Center',
      description: 'Community gathering and activity center',
      lat: 31.6700,
      lng: 74.9000,
      routesPassing: ['Route F - Suburban Connector'],
      landmark: 'Community Hall',
      zone: 'Suburban',
      image: null
    },
    {
      id: 25,
      name: 'School District',
      description: 'Area with multiple schools',
      lat: 31.6650,
      lng: 74.8950,
      routesPassing: ['Route F - Suburban Connector'],
      landmark: 'Central School',
      zone: 'Suburban',
      image: null
    },
    {
      id: 26,
      name: 'Residential Complex',
      description: 'Large residential housing complex',
      lat: 31.6600,
      lng: 74.8900,
      routesPassing: ['Route F - Suburban Connector'],
      landmark: 'Residential Complex',
      zone: 'Suburban',
      image: null
    }
  ];

  // Simulated arrival timeline
  const generateArrivalTimeline = (routesPassing) => {
    const now = new Date();
    const timeline = [];
    routesPassing.forEach((route, index) => {
      const arrivalTime = new Date(now.getTime() + (index + 1) * 15 * 60000); // 15 min intervals
      timeline.push({
        time: arrivalTime,
        route: route
      });
    });
    return timeline.sort((a, b) => a.time - b.time);
  };

  // Generate nearby vehicles with random coordinates near the stop
  const generateNearbyVehicles = (stopLat, stopLng) => {
    const vehicles = [];
    const vehicleNames = ['Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'Vehicle 4', 'Vehicle 5'];
    const vehicleTypes = ['Bus', 'Car', 'Auto', 'Bus', 'Car'];
    const vehicleIds = [1, 2, 3, 4, 5];

    for (let i = 0; i < 5; i++) {
      // Generate random offset within ~2km radius
      const offsetLat = (Math.random() - 0.5) * 0.02; // ~2km
      const offsetLng = (Math.random() - 0.5) * 0.02;
      const vehicleLat = stopLat + offsetLat;
      const vehicleLng = stopLng + offsetLng;
      const distance = calculateDistance(stopLat, stopLng, vehicleLat, vehicleLng);
      const speed = 30 + Math.random() * 40; // Random speed between 30-70 km/h

      vehicles.push({
        id: vehicleIds[i],
        name: vehicleNames[i],
        type: vehicleTypes[i],
        lat: vehicleLat,
        lng: vehicleLng,
        distance: distance,
        speed: speed
      });
    }

    return vehicles.sort((a, b) => a.distance - b.distance).slice(0, 5);
  };

  // Find stop by ID
  useEffect(() => {
    const foundStop = stopsData.find(s => s.id === parseInt(id));
    if (foundStop) {
      setStop(foundStop);
      const vehicles = generateNearbyVehicles(foundStop.lat, foundStop.lng);
      setNearbyVehicles(vehicles);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Fetch ETAs for nearby vehicles
  useEffect(() => {
    if (!stop || nearbyVehicles.length === 0) return;

    const fetchETAs = async () => {
      const newEtas = {};
      for (const vehicle of nearbyVehicles) {
        try {
          const distance = Math.round(vehicle.distance);
          const data = await getETA({ distance });
          const etaMinutes = data?.eta_in_seconds ? Math.round(data.eta_in_seconds / 60) : 0;
          newEtas[vehicle.id] = etaMinutes;
        } catch (error) {
          console.error(`Failed to fetch ETA for vehicle ${vehicle.id}:`, error);
          newEtas[vehicle.id] = 0;
        }
      }
      setVehicleEtas(newEtas);
    };

    fetchETAs();
  }, [stop, nearbyVehicles]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="stop-details-page">
        <Navbar />
        <main className="stop-details-main">
          <div className="loading-state">Loading stop details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="stop-details-page">
        <Navbar />
        <main className="stop-details-main">
          <div className="error-state">
            <h2>Stop Not Found</h2>
            <p>The stop you're looking for doesn't exist.</p>
            <Link to="/routes" className="back-link">← Back to Routes</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const arrivalTimeline = generateArrivalTimeline(stop.routesPassing);

  return (
    <div className="stop-details-page">
      <Navbar />
      <main className="stop-details-main">
        <div className="stop-details-container">
          {/* Header Section */}
          <div className="stop-header">
            <Link to="/routes" className="back-button">← Back to Routes</Link>
            <div className="header-content">
              <h1 className="stop-title">{stop.name}</h1>
              <p className="stop-subtitle">{stop.description}</p>
              <p className="stop-landmark">📍 {stop.landmark}</p>
            </div>
          </div>

          {/* Stop Info Cards */}
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="card-icon">🗺️</div>
              <div className="card-content">
                <h3 className="card-value">{stop.zone}</h3>
                <p className="card-label">Zone</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">🚌</div>
              <div className="card-content">
                <h3 className="card-value">{stop.routesPassing.length}</h3>
                <p className="card-label">Routes Passing</p>
                <div className="routes-list">
                  {stop.routesPassing.map((route, index) => (
                    <span key={index} className="route-tag">{route}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">📍</div>
              <div className="card-content">
                <h3 className="card-value">
                  {stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}
                </h3>
                <p className="card-label">Coordinates</p>
              </div>
            </div>
            <div className="info-card">
              <div className="card-icon">🏛️</div>
              <div className="card-content">
                <h3 className="card-value">{stop.landmark}</h3>
                <p className="card-label">Nearest Landmark</p>
              </div>
            </div>
          </div>

          {/* Mini Map Section */}
          <div className="map-section">
            <h2 className="section-title">Stop Location</h2>
            <div className="map-container">
              {stop ? (
                <MapContainer
                  center={[stop.lat, stop.lng]}
                  zoom={15}
                  style={{ width: '100%', height: '300px', borderRadius: '12px' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[stop.lat, stop.lng]} icon={stopIcon}>
                    <Popup>
                      <strong>{stop.name}</strong><br />
                      {stop.landmark}<br />
                      Lat: {stop.lat.toFixed(6)}<br />
                      Lng: {stop.lng.toFixed(6)}
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Vehicles Section */}
          <div className="nearby-vehicles-section">
            <h2 className="section-title">Nearby Vehicles</h2>
            <div className="vehicles-table-container">
              <table className="vehicles-table">
                <thead>
                  <tr>
                    <th>Vehicle Name</th>
                    <th>Distance</th>
                    <th>Speed</th>
                    <th>ETA</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nearbyVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <div className="vehicle-info-cell">
                          <span className="vehicle-icon-small">
                            {vehicle.type === 'Bus' ? '🚌' : vehicle.type === 'Car' ? '🚗' : '🛺'}
                          </span>
                          <span>{vehicle.name}</span>
                        </div>
                      </td>
                      <td>{(vehicle.distance / 1000).toFixed(2)} km</td>
                      <td>{vehicle.speed.toFixed(1)} km/h</td>
                      <td>
                        <span className="eta-badge">
                          {vehicleEtas[vehicle.id] !== undefined
                            ? `${vehicleEtas[vehicle.id]} min`
                            : '...'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/vehicle/${vehicle.id}`} className="track-link">
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Arrival Timeline Section */}
          {arrivalTimeline.length > 0 && (
            <div className="arrival-timeline-section">
              <h2 className="section-title">Upcoming Arrivals</h2>
              <div className="timeline-list">
                {arrivalTimeline.map((arrival, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">🚌</div>
                    <div className="timeline-content">
                      <div className="timeline-time">{formatTime(arrival.time)}</div>
                      <div className="timeline-route">{arrival.route}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StopDetailsPage;

