function calculateETA(distanceMeters, speedKmph) {
    const speedMps = speedKmph * (1000 / 3600); // convert km/h to m/s
    const etaSeconds = distanceMeters / speedMps;
    return etaSeconds;
}

module.exports = calculateETA;
