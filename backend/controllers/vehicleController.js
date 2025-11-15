// const simulateMovement = require("../utils/simulator");
// const calculateETA = require("../utils/eta");

// // A simple demo route (you can replace coordinates)
// const routeCoordinates = [
//     { lat: 31.6331, lng: 74.8723 },
//     { lat: 31.6360, lng: 74.8742 },
//     { lat: 31.6380, lng: 74.8751 },
//     { lat: 31.6400, lng: 74.8767 }
// ];

// Initialize the simulation
// const getLocation = simulateMovement(routeCoordinates);

// exports.getLiveLocation = (req, res) => {
//     const location = getLocation();
//     res.json(location);
// };

// exports.getETA = (req, res) => {
//     const { distance } = req.query; // distance in meters

//     const ETA = calculateETA(Number(distance), 25); // 25 km/h speed
//     res.json({ eta_in_seconds: ETA });
// };
const { getLiveLocation } = require("../utils/simulator");
const calculateETA = require("../utils/eta");

exports.getLiveLocation = (req, res) => {
    try {
        const location = getLiveLocation();
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get live location' });
    }
};

exports.getETA = (req, res) => {
    const distance = Number(req.query.distance);
    const eta = calculateETA(distance, 25);
    res.json({ eta_in_seconds: eta });
};
