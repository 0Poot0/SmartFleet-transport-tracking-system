const express = require("express");
const Vehicle = require("../models/Vehicle");
const Route = require("../models/Route");

const router = express.Router();

// POST /api/admin/vehicles — create a vehicle
router.post("/vehicles", async (req, res) => {
  try {
    const { name, type, status, plateNumber } = req.body || {};
    if (!name || !type || !status || !plateNumber) {
      return res.status(400).json({ error: "name, type, status, plateNumber are required" });
    }

    const created = await Vehicle.create({ name, type, status, plateNumber });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create vehicle" });
  }
});

// GET /api/admin/vehicles — get all vehicles with count
router.get("/vehicles", async (_req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    return res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// POST /api/admin/routes — create a route
router.post("/routes", async (req, res) => {
  try {
    const { name, status, stops, description } = req.body || {};
    if (!name || !status) {
      return res.status(400).json({ error: "name and status are required" });
    }

    const stopsArray = Array.isArray(stops) ? stops : [];
    const created = await Route.create({
      name,
      status,
      stops: stopsArray,
      description: description || ""
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create route" });
  }
});

// GET /api/admin/routes — get all routes with count
router.get("/routes", async (_req, res) => {
  try {
    const routes = await Route.find({}).sort({ createdAt: -1 });
    return res.json({ count: routes.length, routes });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch routes" });
  }
});

module.exports = router;

