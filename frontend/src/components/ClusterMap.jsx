import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { createVehicleMarker } from '../utils/leafletIcons';
import './ClusterMap.css';

// Initialize markercluster
require('leaflet.markercluster');

const ClusterMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const markerClusterGroupRef = useRef(null);
  const markersRef = useRef([]);

  // Default center
  const defaultCenter = [31.6331, 74.8723];

  // Generate random vehicle data
  const generateVehicles = (count = 30) => {
    const types = ['Bus', 'Car', 'Auto', 'Truck'];
    const newVehicles = [];

    for (let i = 0; i < count; i++) {
      const lat = defaultCenter[0] + (Math.random() - 0.5) * 0.2;
      const lng = defaultCenter[1] + (Math.random() - 0.5) * 0.2;
      
      newVehicles.push({
        id: i + 1,
        name: `Vehicle ${i + 1}`,
        type: types[Math.floor(Math.random() * types.length)],
        lat: lat,
        lng: lng,
        speed: Math.floor(Math.random() * 60) + 20
      });
    }

    return newVehicles;
  };

  // Initialize vehicles
  useEffect(() => {
    setVehicles(generateVehicles(30));
  }, []);

  // Update vehicle positions every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => ({
          ...vehicle,
          lat: vehicle.lat + (Math.random() - 0.5) * 0.01,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.01,
          speed: Math.floor(Math.random() * 60) + 20
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Filter vehicles by type
  const filteredVehicles = vehicles.filter(vehicle => {
    if (vehicleTypeFilter === 'all') return true;
    return vehicle.type.toLowerCase() === vehicleTypeFilter.toLowerCase();
  });

  // Component to manage markers and clustering
  function MarkerClusterLayer({ vehicles }) {
    const map = useMap();
    const clusterGroupRef = useRef(null);

    useEffect(() => {
      if (!map) return;

      // Create marker cluster group if it doesn't exist
      if (!clusterGroupRef.current) {
        clusterGroupRef.current = L.markerClusterGroup({
          chunkedLoading: true,
          maxClusterRadius: 50,
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            let color = '#a5d6a7'; // Light green - small cluster
            if (count > 10) {
              color = '#e53935'; // Red - large cluster
            } else if (count > 5) {
              color = '#ffb74d'; // Orange - medium cluster
            }

            return L.divIcon({
              html: `<div style="
                background-color: ${color};
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">${count}</div>`,
              className: 'marker-cluster',
              iconSize: L.point(50, 50)
            });
          }
        });
        map.addLayer(clusterGroupRef.current);
      }

      // Clear existing markers
      clusterGroupRef.current.clearLayers();
      markersRef.current = [];

      // Add new markers
      vehicles.forEach(vehicle => {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
          icon: createVehicleMarker('🚗')
        });

        marker.bindPopup(`
          <div class="info-window">
            <h4>${vehicle.name}</h4>
            <p><strong>Type:</strong> ${vehicle.type}</p>
            <p><strong>Speed:</strong> ${vehicle.speed} km/h</p>
            <p><strong>Location:</strong></p>
            <p>Lat: ${vehicle.lat.toFixed(6)}</p>
            <p>Lng: ${vehicle.lng.toFixed(6)}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedVehicle(vehicle);
        });

        clusterGroupRef.current.addLayer(marker);
        markersRef.current.push(marker);
      });

      markerClusterGroupRef.current = clusterGroupRef.current;

      return () => {
        if (clusterGroupRef.current) {
          map.removeLayer(clusterGroupRef.current);
          clusterGroupRef.current = null;
        }
      };
    }, [map, vehicles]);

    return null;
  }

  // Re-center map function
  const reCenterMap = () => {
    // This will be handled by the map component
    if (filteredVehicles.length > 0) {
      const bounds = filteredVehicles.reduce((bounds, vehicle) => {
        return bounds.extend([vehicle.lat, vehicle.lng]);
      }, L.latLngBounds([]));
      
      // We'll need to access the map instance - this is a simplified version
      // In a real implementation, you'd use a ref or state to control the map
    }
  };

  return (
    <div className="cluster-map-container">
      <div className="map-controls">
        <div className="control-group">
          <label>Vehicle Type:</label>
          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Vehicles</option>
            <option value="bus">Bus</option>
            <option value="car">Car</option>
            <option value="auto">Auto</option>
            <option value="truck">Truck</option>
          </select>
        </div>
        <div className="control-group">
          <button
            className="control-btn"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            className="control-btn"
            onClick={reCenterMap}
          >
            🎯 Re-center
          </button>
        </div>
        <div className="vehicle-count">
          Showing: {filteredVehicles.length} vehicles
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ width: '100%', height: '500px', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterLayer vehicles={filteredVehicles} />
        {selectedVehicle && (
          <Marker
            position={[selectedVehicle.lat, selectedVehicle.lng]}
            icon={createVehicleMarker('🚗')}
          >
            <Popup>
              <div className="info-window">
                <h4>{selectedVehicle.name}</h4>
                <p><strong>Type:</strong> {selectedVehicle.type}</p>
                <p><strong>Speed:</strong> {selectedVehicle.speed} km/h</p>
                <p><strong>Location:</strong></p>
                <p>Lat: {selectedVehicle.lat.toFixed(6)}</p>
                <p>Lng: {selectedVehicle.lng.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="cluster-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#a5d6a7' }}></span>
          <span>Small Cluster (1-5)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffb74d' }}></span>
          <span>Medium Cluster (6-10)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#e53935' }}></span>
          <span>Large Cluster (11+)</span>
        </div>
      </div>
    </div>
  );
};

export default ClusterMap;
