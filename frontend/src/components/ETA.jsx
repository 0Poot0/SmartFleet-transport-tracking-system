import React, { useState, useEffect } from 'react';
import { getETA } from '../services/api';

const ETA = () => {
  const [etaData, setEtaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchETA = async () => {
      try {
        setError(null);
        setLoading(true);
        // You can pass query params here if needed
        // Example: const data = await getETA({ vehicleId: '123', destination: '...' });
        const data = await getETA();
        setEtaData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch ETA data');
        setLoading(false);
      }
    };

    fetchETA();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>ETA</h2>
        <div className="loading">Loading ETA data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>ETA</h2>
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>ETA Information</h2>
      <div className="eta-data">
        <pre>{JSON.stringify(etaData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ETA;

