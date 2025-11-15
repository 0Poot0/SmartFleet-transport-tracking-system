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

const router = express.Router();

router.get("/live-location", getLiveLocation);
router.get("/eta", getETA);

module.exports = router;
