require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const vehicleRoutes = require("./routes/vehicleRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { startSimulation, getLiveLocation } = require("./utils/simulator");

// ✅ Create app FIRST
const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Prometheus setup
const client = require("prom-client");
const register = new client.Registry();

client.collectDefaultMetrics({ register });

// 🔹 Metrics route (ONLY ONCE)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// 🔹 Routes
app.use("/api", vehicleRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/live-location", (req, res) => {
  res.json({
    pod: process.env.HOSTNAME,
    data: getLiveLocation()
  });
});

// Optional root route
app.get("/", (req, res) => {
  res.send(`Response from pod: ${process.env.HOSTNAME}`);
});

// 🔹 Start server
async function start() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/transport_tracker";
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  app.listen(5000, () => {
    console.log("Backend server running on http://localhost:5000");
    console.log("Starting vehicle movement simulation...");
    startSimulation();
  });
}

start().catch((err) => {
  console.error("Failed to start backend:", err);
  process.exit(1);
});