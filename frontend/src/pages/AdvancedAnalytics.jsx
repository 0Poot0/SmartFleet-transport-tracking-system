import React, { useState, useEffect, useRef } from 'react';

import Footer from '../components/Footer';
import AnimatedHeatmap from '../components/AnimatedHeatmap';
import ClusterMap from '../components/ClusterMap';
import { getLiveLocation, getETA } from '../services/api';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [speedHistory, setSpeedHistory] = useState([]);
  const [multiVehicleData, setMultiVehicleData] = useState([]);
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const [etaHistory, setEtaHistory] = useState([]);
  const [congestionZones, setCongestionZones] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    totalApiCalls: 0,
    totalUpdates: 0,
    avgResponseTime: 0,
    startTime: Date.now()
  });

  const speedDataRef = useRef([]);
  const maxSpeedRef = useRef(0);
  const minSpeedRef = useRef(Infinity);

  // Initialize congestion zones
  useEffect(() => {
    const zones = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Zone ${i + 1}`,
      congestion: Math.floor(Math.random() * 10) + 1
    }));
    setCongestionZones(zones);
  }, []);

  // Initialize multi-vehicle data
  useEffect(() => {
    const vehicles = ['Vehicle A', 'Vehicle B', 'Vehicle C', 'Vehicle D'];
    const initialData = vehicles.map((vehicle, index) => ({
      time: new Date().toLocaleTimeString(),
      [vehicle]: Math.floor(Math.random() * 60) + 20
    }));
    setMultiVehicleData(initialData);
  }, []);

  // Fetch live location and update charts
  const fetchAndUpdate = async () => {
    try {
      const startTime = performance.now();
      const data = await getLiveLocation();
      const responseTime = performance.now() - startTime;

      const speed = data?.speed || 0;
      
      // Update speed history
      speedDataRef.current.push(speed);
      if (speedDataRef.current.length > 10) {
        speedDataRef.current.shift();
      }

      // Update max/min speed
      if (speed > maxSpeedRef.current) maxSpeedRef.current = speed;
      if (speed < minSpeedRef.current && speed > 0) minSpeedRef.current = speed;

      // Update speed history for chart
      setSpeedHistory(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), speed }];
        return newData.slice(-20);
      });

      // Update multi-vehicle data
      setMultiVehicleData(prev => {
        const vehicles = ['Vehicle A', 'Vehicle B', 'Vehicle C', 'Vehicle D'];
        const newEntry = {
          time: new Date().toLocaleTimeString(),
        };
        vehicles.forEach(vehicle => {
          newEntry[vehicle] = Math.floor(Math.random() * 60) + 20;
        });
        const updated = [...prev, newEntry];
        return updated.slice(-15);
      });

      // Update vehicle locations (scatter plot)
      setVehicleLocations(prev => {
        const vehicles = ['A', 'B', 'C', 'D'];
        const newLocations = vehicles.map((v, i) => ({
          vehicle: `Vehicle ${v}`,
          longitude: (data?.longitude || data?.lng || data?.lon || 74.8) + (Math.random() - 0.5) * 0.1,
          latitude: (data?.latitude || data?.lat || 31.6) + (Math.random() - 0.5) * 0.1
        }));
        return newLocations;
      });

      // Update congestion zones randomly
      setCongestionZones(prev => prev.map(zone => ({
        ...zone,
        congestion: Math.floor(Math.random() * 10) + 1
      })));

      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        totalApiCalls: prev.totalApiCalls + 1,
        totalUpdates: prev.totalUpdates + 1,
        avgResponseTime: ((prev.avgResponseTime * (prev.totalApiCalls - 1)) + responseTime) / prev.totalApiCalls
      }));
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
  };

  // Fetch ETA data
  const fetchETA = async () => {
    try {
      const data = await getETA({ distance: 2000 });
      const etaSeconds = data?.eta_in_seconds || 0;
      const etaMinutes = etaSeconds / 60;

      setEtaHistory(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          eta: etaMinutes
        }];
        return newData.slice(-20);
      });
    } catch (error) {
      console.error('Failed to fetch ETA:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAndUpdate();
    fetchETA();

    // Set up intervals
    const locationInterval = setInterval(fetchAndUpdate, 5000);
    const etaInterval = setInterval(fetchETA, 5000);

    return () => {
      clearInterval(locationInterval);
      clearInterval(etaInterval);
    };
  }, []);

  // Calculate average speed from last 10 responses
  const averageSpeed = speedDataRef.current.length > 0
    ? (speedDataRef.current.reduce((a, b) => a + b, 0) / speedDataRef.current.length).toFixed(1)
    : 0;

  // Calculate activity level (simulated)
  const activeVehicles = speedDataRef.current.filter(s => s > 0).length;
  const activityLevel = speedDataRef.current.length > 0
    ? ((activeVehicles / speedDataRef.current.length) * 100).toFixed(0)
    : 0;

  // Calculate uptime
  const [uptime, setUptime] = useState('00:00:00');
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStats.startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setUptime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStats.startTime]);

  // Route popularity data
  const routeData = [
    { route: 'Route A', trips: 40 },
    { route: 'Route B', trips: 25 },
    { route: 'Route C', trips: 30 },
    { route: 'Route D', trips: 10 }
  ];

  // Get congestion color
  const getCongestionColor = (level) => {
    if (level <= 3) return '#c8e6c9'; // Light green
    if (level <= 5) return '#fff9c4'; // Yellow
    if (level <= 7) return '#ffcc80'; // Orange
    return '#ffcdd2'; // Red
  };

  const colors = ['#2e7d32', '#1976d2', '#f57c00', '#7b1fa2'];

  return (
    <div className="advanced-analytics-page">

      <main className="analytics-main">
        <div className="analytics-container">
          <h1 className="analytics-title">Advanced Analytics</h1>

          {/* A) Vehicle Performance Summary */}
          <section className="performance-summary">
            <h2 className="section-title">Vehicle Performance Summary</h2>
            <div className="performance-cards">
              <div className="perf-card">
                <div className="perf-icon">⚡</div>
                <div className="perf-content">
                  <h3 className="perf-value">{averageSpeed} km/h</h3>
                  <p className="perf-label">Average System Speed</p>
                </div>
              </div>
              <div className="perf-card">
                <div className="perf-icon">📈</div>
                <div className="perf-content">
                  <h3 className="perf-value">{maxSpeedRef.current.toFixed(1)} km/h</h3>
                  <p className="perf-label">Max Speed Recorded</p>
                </div>
              </div>
              <div className="perf-card">
                <div className="perf-icon">📉</div>
                <div className="perf-content">
                  <h3 className="perf-value">
                    {minSpeedRef.current === Infinity ? '0' : minSpeedRef.current.toFixed(1)} km/h
                  </h3>
                  <p className="perf-label">Min Speed Recorded</p>
                </div>
              </div>
              <div className="perf-card">
                <div className="perf-icon">🎯</div>
                <div className="perf-content">
                  <h3 className="perf-value">{activityLevel}%</h3>
                  <p className="perf-label">Vehicle Activity Level</p>
                </div>
              </div>
            </div>
          </section>

          {/* B) Multi-Vehicle Comparison Chart */}
          <section className="chart-section">
            <h2 className="section-title">Multi-Vehicle Speed Comparison</h2>
            <div className="chart-card">
              {multiVehicleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={multiVehicleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Vehicle A" stroke={colors[0]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Vehicle B" stroke={colors[1]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Vehicle C" stroke={colors[2]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Vehicle D" stroke={colors[3]} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">Loading vehicle data...</div>
              )}
            </div>
          </section>

          {/* C) Route Popularity Visualization */}
          <section className="chart-section">
            <h2 className="section-title">Route Popularity</h2>
            <div className="chart-card">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={routeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" />
                  <YAxis label={{ value: 'Number of Trips', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trips" fill="#2e7d32" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Animated Heatmap Section */}
          <section className="chart-section">
            <AnimatedHeatmap />
          </section>

          {/* Live Vehicle Cluster Map */}
          <section className="chart-section">
            <h2 className="section-title">Live Vehicle Cluster Map</h2>
            <ClusterMap />
          </section>

          {/* D) Heatmap-style Congestion Indicator */}
          <section className="congestion-section">
            <h2 className="section-title">City Zone Congestion Heatmap</h2>
            <div className="heatmap-grid">
              {congestionZones.map(zone => (
                <div
                  key={zone.id}
                  className="heatmap-cell"
                  style={{
                    backgroundColor: getCongestionColor(zone.congestion),
                    borderColor: zone.congestion > 7 ? '#c62828' : '#2e7d32'
                  }}
                >
                  <div className="zone-name">{zone.name}</div>
                  <div className="zone-score">Level {zone.congestion}</div>
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#c8e6c9' }}></span> Low (1-3)</span>
              <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#fff9c4' }}></span> Medium (4-5)</span>
              <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#ffcc80' }}></span> High (6-7)</span>
              <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#ffcdd2' }}></span> Critical (8-10)</span>
            </div>
          </section>

          {/* E) Vehicle Location Scatter Plot */}
          <section className="chart-section">
            <h2 className="section-title">Vehicle Location Scatter Plot</h2>
            <div className="chart-card">
              {vehicleLocations.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="longitude" name="Longitude" label={{ value: 'Longitude', position: 'insideBottom', offset: -5 }} />
                    <YAxis type="number" dataKey="latitude" name="Latitude" label={{ value: 'Latitude', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Vehicles" data={vehicleLocations} fill="#2e7d32">
                      {vehicleLocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">Loading location data...</div>
              )}
            </div>
          </section>

          {/* F) ETA Prediction Chart */}
          <section className="chart-section">
            <h2 className="section-title">Dynamic ETA Prediction Trend</h2>
            <div className="chart-card">
              {etaHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={etaHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'ETA (minutes)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="eta"
                      stroke="#2e7d32"
                      strokeWidth={2}
                      dot={{ fill: '#2e7d32', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">Loading ETA predictions...</div>
              )}
            </div>
          </section>

          {/* G) Session Summary */}
          <section className="session-summary">
            <h2 className="section-title">Session Summary</h2>
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">Total API Calls:</span>
                <span className="summary-value">{sessionStats.totalApiCalls}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Updates:</span>
                <span className="summary-value">{sessionStats.totalUpdates}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Avg Response Time:</span>
                <span className="summary-value">{sessionStats.avgResponseTime.toFixed(2)} ms</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">System Uptime:</span>
                <span className="summary-value">{uptime}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedAnalytics;

