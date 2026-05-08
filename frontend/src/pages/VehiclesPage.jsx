import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';
import './VehiclesPage.css';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample vehicles data - replace with API call if needed
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleVehicles = [
        {
          id: 1,
          name: 'Vehicle 1',
          type: 'Bus',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Vehicle 2',
          type: 'Car',
          status: 'On Route'
        },
        {
          id: 3,
          name: 'Vehicle 3',
          type: 'Auto',
          status: 'Active'
        },
        {
          id: 4,
          name: 'Vehicle 4',
          type: 'Bus',
          status: 'Inactive'
        },
        {
          id: 5,
          name: 'Vehicle 5',
          type: 'Car',
          status: 'Active'
        },
        {
          id: 6,
          name: 'Vehicle 6',
          type: 'Auto',
          status: 'On Route'
        },
        {
          id: 7,
          name: 'Vehicle 7',
          type: 'Bus',
          status: 'Active'
        },
        {
          id: 8,
          name: 'Vehicle 8',
          type: 'Car',
          status: 'Inactive'
        },
        {
          id: 9,
          name: 'Vehicle 9',
          type: 'Bus',
          status: 'On Route'
        }
      ];
      setVehicles(sampleVehicles);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="vehicles-page">
      <main className="vehicles-main">
        <div className="vehicles-container">
          <h1 className="vehicles-title">Available Vehicles</h1>
          {loading ? (
            <div className="loading-state">Loading vehicles...</div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">No vehicles available</div>
          ) : (
            <div className="vehicles-grid">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehiclesPage;

