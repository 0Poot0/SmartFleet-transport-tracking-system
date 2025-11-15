// Live Vehicle Movement Simulator
// Simulates a vehicle moving along a predefined route

// Dummy vehicle object
let vehicle = {
  id: 1,
  lat: 31.6331,
  lng: 74.8723,
  speed: 30, // km/h
  index: 0,
  timestamp: new Date().toISOString()
};

// Route coordinates array (5-10 coordinates)
const routeCoordinates = [
  { lat: 31.6331, lng: 74.8723 }, // Central Station
  { lat: 31.6360, lng: 74.8742 }, // Main Square
  { lat: 31.6380, lng: 74.8751 }, // City Hall
  { lat: 31.6400, lng: 74.8767 }, // Shopping District
  { lat: 31.6420, lng: 74.8780 }, // Park Avenue
  { lat: 31.6440, lng: 74.8795 }, // Museum
  { lat: 31.6460, lng: 74.8810 }, // Library
  { lat: 31.6480, lng: 74.8825 }  // Terminal
];

let simulationInterval = null;

/**
 * Start the vehicle movement simulation
 * Updates vehicle position every 3 seconds
 */
function startSimulation() {
  // Initialize vehicle at first route point
  vehicle.lat = routeCoordinates[0].lat;
  vehicle.lng = routeCoordinates[0].lng;
  vehicle.index = 0;
  vehicle.speed = 20 + Math.random() * 20; // Random speed between 20-40 km/h
  vehicle.timestamp = new Date().toISOString();

  console.log('🚗 Vehicle simulation started');
  console.log(`📍 Starting at: ${vehicle.lat}, ${vehicle.lng}`);

  // Update vehicle position every 3 seconds
  simulationInterval = setInterval(() => {
    // Move to next coordinate
    vehicle.index = (vehicle.index + 1) % routeCoordinates.length;
    
    // Update position
    const currentPoint = routeCoordinates[vehicle.index];
    vehicle.lat = currentPoint.lat;
    vehicle.lng = currentPoint.lng;
    
    // Update speed randomly (20-40 km/h)
    vehicle.speed = 20 + Math.random() * 20;
    
    // Update timestamp
    vehicle.timestamp = new Date().toISOString();

    console.log(`🚗 Vehicle moved to point ${vehicle.index + 1}/${routeCoordinates.length}: ${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)} | Speed: ${vehicle.speed.toFixed(1)} km/h`);
  }, 3000); // 3 seconds
}

/**
 * Stop the simulation
 */
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('🛑 Vehicle simulation stopped');
  }
}

/**
 * Get current live location of the vehicle
 * @returns {Object} Vehicle location data
 */
function getLiveLocation() {
  return {
    id: vehicle.id,
    latitude: vehicle.lat,
    longitude: vehicle.lng,
    lat: vehicle.lat, // Alternative key for compatibility
    lng: vehicle.lng,  // Alternative key for compatibility
    speed: vehicle.speed,
    timestamp: vehicle.timestamp,
    index: vehicle.index,
    vehicleName: `Vehicle ${vehicle.id}`
  };
}

module.exports = {
  startSimulation,
  stopSimulation,
  getLiveLocation
};
