import React, { useState, useEffect } from 'react';
import './AnimatedHeatmap.css';

const AnimatedHeatmap = () => {
  const [zones, setZones] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize zones (4x4 grid = 16 zones)
  useEffect(() => {
    const initialZones = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      name: `Zone ${i + 1}`,
      congestion: Math.floor(Math.random() * 10) + 1
    }));
    setZones(initialZones);
  }, []);

  // Update congestion values every 3 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setZones(prevZones =>
        prevZones.map(zone => ({
          ...zone,
          congestion: Math.floor(Math.random() * 10) + 1
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Get color based on congestion level
  const getCongestionColor = (level) => {
    if (level <= 3) return '#c8e6c9'; // Light green - Low
    if (level <= 5) return '#fff9c4'; // Light yellow - Medium-Low
    if (level <= 7) return '#ffcc80'; // Orange - Medium-High
    return '#e53935'; // Red - High
  };

  // Get text color based on background
  const getTextColor = (level) => {
    if (level <= 3) return '#1b5e20'; // Dark green text
    if (level <= 5) return '#f57f17'; // Dark yellow text
    if (level <= 7) return '#e65100'; // Dark orange text
    return '#ffffff'; // White text for red background
  };

  return (
    <div className="animated-heatmap-container">
      <div className="heatmap-header">
        <div className="heatmap-title-section">
          <h3 className="heatmap-title">Animated Congestion Heatmap</h3>
          <div className="refresh-indicator">
            <span className={`indicator-dot ${isPaused ? 'paused' : 'active'}`}></span>
            <span>Auto Refresh: {isPaused ? 'OFF' : 'ON'}</span>
          </div>
        </div>
        <button
          className="pause-toggle-btn"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>

      <div className="heatmap-grid">
        {zones.map(zone => (
          <div
            key={zone.id}
            className="heatmap-cell"
            style={{
              backgroundColor: getCongestionColor(zone.congestion),
              color: getTextColor(zone.congestion)
            }}
          >
            <div className="zone-name">{zone.name}</div>
            <div className="zone-score">{zone.congestion}</div>
            <div className="zone-label">
              {zone.congestion <= 3 ? 'Low' :
               zone.congestion <= 5 ? 'Med-Low' :
               zone.congestion <= 7 ? 'Med-High' : 'High'}
            </div>
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#c8e6c9' }}></span>
          <span className="legend-text">Low (1-3)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#fff9c4' }}></span>
          <span className="legend-text">Medium-Low (4-5)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffcc80' }}></span>
          <span className="legend-text">Medium-High (6-7)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#e53935' }}></span>
          <span className="legend-text">High (8-10)</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeatmap;

