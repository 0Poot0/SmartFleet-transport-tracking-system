import React from 'react';
import MapView from './MapView';

const LiveMap = ({ lat, lng, vehicleName = 'Vehicle' }) => {
  return (
    <div className="live-map-container">
      <MapView lat={lat} lng={lng} vehicleName={vehicleName} />
    </div>
  );
};

export default LiveMap;

