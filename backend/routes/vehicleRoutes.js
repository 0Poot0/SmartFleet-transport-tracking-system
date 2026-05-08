// const express = require("express");
// const { getLiveLocation, getETA } = require("../controllers/vehicleController");

// const router = express.Router();

// // ✅ Test route
// router.get("/hello", (req, res) => {
//     res.send("Hello from vehicleRoutes!");
// });

// // GET live location (simulated)
// router.get("/live-location", getLiveLocation);

// // GET ETA
// router.get("/eta", getETA);

// module.exports = router;
const express = require("express");
const { getLiveLocation, getETA } = require("../controllers/vehicleController");
const Route = require("../models/Route");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

router.get("/live-location", getLiveLocation);
router.get("/eta", getETA);

// GET /api/routes
router.get("/routes", async (req, res) => {
  try {
    const routes = await Route.find({}).sort({ createdAt: -1 });
    res.json({ count: routes.length, routes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// GET /api/vehicles
router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.json({ count: vehicles.length, vehicles });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

module.exports = router;
