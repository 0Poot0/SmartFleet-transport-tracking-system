import React from 'react';
import { Link } from 'react-router-dom';
import './RouteCard.css';

const RouteCard = ({ route }) => {
  const { id, name, stops } = route;

  return (
    <div className="route-card">
      <h3 className="route-card-name">{name}</h3>
      <div className="route-card-stops">
        {stops && stops.length > 0 ? (
          <div className="stops-list">
            {stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <span className="stop-number">{index + 1}</span>
                <span className="stop-name">{typeof stop === 'string' ? stop : stop.name}</span>
                {index < stops.length - 1 && (
                  <span className="stop-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-stops">No stops available</p>
        )}
      </div>
      {id && (
        <div className="route-card-footer">
          <Link to={`/route/${id}`} className="view-details-link">
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RouteCard;

