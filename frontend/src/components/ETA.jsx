import React, { useState, useEffect } from 'react';
import { getETA } from '../services/api';
import './ETA.css';

const ETA = () => {
  const [distance, setDistance] = useState(1200);
  const [speed, setSpeed] = useState(25);
  const [etaData, setEtaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchETA = async (dist, spd) => {
    try {
      setError(null);
      setLoading(true);
      const data = await getETA({ distance: dist, speed: spd });
      setEtaData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch ETA data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchETA(distance, speed);
  }, []);

  const handleDistanceChange = (e) => {
    const newDistance = Number(e.target.value);
    setDistance(newDistance);
    fetchETA(newDistance, speed);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const handleRecalculate = () => {
    fetchETA(distance, speed);
  };

  const formatETA = (etaData) => {
    if (!etaData || !etaData.eta_in_seconds) return 'N/A';
    const totalSeconds = Math.round(etaData.eta_in_seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="eta-page">
      <div className="eta-container">
        <div className="eta-card">
          <div className="eta-header">
            <h1>⚡ ETA Calculator</h1>
            <p>Calculate estimated arrival time based on distance and speed</p>
          </div>

          <div className="eta-input-section">
            <div className="input-group">
              <label htmlFor="distance">Distance</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="distance"
                  value={distance}
                  onChange={handleDistanceChange}
                  min="1"
                  className="distance-input"
                />
                <span className="unit">meters</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="speed">Speed</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="speed"
                  value={speed}
                  onChange={handleSpeedChange}
                  min="1"
                  className="speed-input"
                />
                <span className="unit">km/h</span>
              </div>
            </div>

            <button className="recalculate-btn" onClick={handleRecalculate}>
              Recalculate
            </button>
          </div>

          <div className="eta-result-section">
            <div className="eta-result-card">
              <div className="eta-display">
                <div className="eta-label">ETA</div>
                <div className="eta-value">
                  {loading ? (
                    <span className="loading-text">Calculating...</span>
                  ) : error ? (
                    <span className="error-text">Error</span>
                  ) : (
                    formatETA(etaData)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETA;

