import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getLiveLocation } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [liveData, setLiveData] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for statistics
  const [stats] = useState({
    totalVehicles: 25,
    activeVehicles: 18,
    totalRoutes: 12,
    averageSpeed: 0
  });

  // Sample data for vehicle count by type
  const vehicleTypeData = [
    { type: 'Bus', count: 10 },
    { type: 'Car', count: 8 },
    { type: 'Auto', count: 5 },
    { type: 'Bike', count: 2 }
  ];

  // Fetch live location data
  const fetchLiveData = async () => {
    try {
      const data = await getLiveLocation();
      setLiveData(data);
      
      // Update speed history for line chart
      const speed = data?.speed || 0;
      setSpeedHistory(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString(), speed: speed }];
        // Keep only last 20 data points
        return newHistory.slice(-20);
      });

      // Update average speed in stats
      if (speed > 0) {
        stats.averageSpeed = speed;
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch live data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchLiveData();

    // Then fetch every 5 seconds
    const interval = setInterval(() => {
      fetchLiveData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Dashboard Analytics</h1>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.totalVehicles}</h3>
                <p className="stat-label">Total Vehicles</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.activeVehicles}</h3>
                <p className="stat-label">Active Vehicles</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🗺️</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.totalRoutes}</h3>
                <p className="stat-label">Total Routes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {loading ? '...' : (liveData?.speed || stats.averageSpeed).toFixed(1)} km/h
                </h3>
                <p className="stat-label">Average Speed</p>
              </div>
            </div>
          </div>

          {/* Charts and Live Data Section */}
          <div className="dashboard-content">
            {/* Left Column - Charts */}
            <div className="charts-section">
              {/* Line Chart - Vehicle Speed Trend */}
              <div className="chart-card">
                <h2 className="chart-title">Vehicle Speed Trend</h2>
                {speedHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={speedHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#2e7d32" 
                        strokeWidth={2}
                        dot={{ fill: '#2e7d32', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-loading">Loading speed data...</div>
                )}
              </div>

              {/* Bar Chart - Vehicle Count Per Type */}
              <div className="chart-card">
                <h2 className="chart-title">Vehicle Count Per Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehicleTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#2e7d32" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column - Live Data Widget */}
            <div className="live-data-section">
              <div className="live-data-card">
                <h2 className="live-data-title">Live Data Widget</h2>
                {loading && !liveData ? (
                  <div className="loading-state">Loading live data...</div>
                ) : liveData ? (
                  <div className="live-data-content">
                    <div className="data-item">
                      <span className="data-label">Speed:</span>
                      <span className="data-value">{liveData.speed || 0} km/h</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Latitude:</span>
                      <span className="data-value">
                        {(liveData.latitude || liveData.lat || 0).toFixed(6)}
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Longitude:</span>
                      <span className="data-value">
                        {(liveData.longitude || liveData.lng || liveData.lon || 0).toFixed(6)}
                      </span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Timestamp:</span>
                      <span className="data-value timestamp">
                        {formatTimestamp(liveData.timestamp)}
                      </span>
                    </div>
                    <div className="refresh-indicator">
                      <span className="indicator-dot"></span>
                      Auto-refreshing every 5 seconds
                    </div>
                  </div>
                ) : (
                  <div className="error-state">Failed to load live data</div>
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

export default Dashboard;

