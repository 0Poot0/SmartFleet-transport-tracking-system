const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");
const { startSimulation, getLiveLocation } = require("./utils/simulator");

const client = require('prom-client');
client.collectDefaultMetrics();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", vehicleRoutes);

// Direct API route for live location (alternative to controller)
app.get("/api/live-location", (req, res) => {
  res.json(getLiveLocation());
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start vehicle simulation when server starts
app.listen(5000, () => {
    console.log("Backend server running on http://localhost:5000");
    console.log("Starting vehicle movement simulation...");
    startSimulation();
});

app.get('/', (req, res) => {
  res.send('Backend is running...');
});
