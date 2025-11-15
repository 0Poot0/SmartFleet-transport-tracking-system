import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  const { id, name, type, status } = vehicle;

  // Get icon based on vehicle type
  const getVehicleIcon = (vehicleType) => {
    const typeLower = vehicleType?.toLowerCase() || '';
    if (typeLower.includes('bus')) {
      return '🚌';
    } else if (typeLower.includes('car')) {
      return '🚗';
    } else if (typeLower.includes('auto') || typeLower.includes('auto-rickshaw')) {
      return '🛺';
    } else if (typeLower.includes('truck')) {
      return '🚚';
    } else if (typeLower.includes('van')) {
      return '🚐';
    } else {
      return '🚙';
    }
  };

  // Get status badge class
  const getStatusClass = (vehicleStatus) => {
    const statusLower = vehicleStatus?.toLowerCase() || '';
    if (statusLower.includes('active')) {
      return 'status-active';
    } else if (statusLower.includes('inactive')) {
      return 'status-inactive';
    } else if (statusLower.includes('route')) {
      return 'status-on-route';
    }
    return 'status-default';
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div className="vehicle-icon">{getVehicleIcon(type)}</div>
        <div className="vehicle-info">
          <h3 className="vehicle-name">{name}</h3>
          <p className="vehicle-type">{type}</p>
        </div>
      </div>
      <div className="vehicle-card-footer">
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
      {id && (
        <div className="vehicle-card-actions">
          <Link to={`/vehicle/${id}`} className="view-details-link">
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;

