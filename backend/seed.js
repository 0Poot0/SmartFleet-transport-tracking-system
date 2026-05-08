require("dotenv").config();
const mongoose = require("mongoose");
const Route = require("./models/Route");
const Vehicle = require("./models/Vehicle");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/transport_tracker";

const sampleRoutes = [
  { name: "Route A - Downtown Express", status: "Active", stops: ["Stop 1", "Stop 2", "Stop 3", "Stop 4", "Stop 5"] },
  { name: "Route B - Airport Shuttle", status: "Active", stops: ["Stop 1", "Stop 2", "Stop 3", "Stop 4", "Stop 5", "Stop 6", "Stop 7", "Stop 8"] },
  { name: "Route C - University Line", status: "Active", stops: ["Stop 1", "Stop 2", "Stop 3", "Stop 4", "Stop 5", "Stop 6"] },
  { name: "Route D - Market Circle", status: "Active", stops: ["Stop 1", "Stop 2", "Stop 3", "Stop 4"] }
];

const sampleVehicles = [
  { name: "Bus 001", type: "Bus", status: "Active", plateNumber: "ROUTE-A-01" }, // Using plateNumber as route to link them conceptually for the sample
  { name: "Bus 002", type: "Bus", status: "Active", plateNumber: "ROUTE-B-01" },
  { name: "Car 001", type: "Car", status: "Idle", plateNumber: "ROUTE-C-01" },
  { name: "Auto 001", type: "Auto", status: "Active", plateNumber: "ROUTE-D-01" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const routeCount = await Route.countDocuments();
    const vehicleCount = await Vehicle.countDocuments();

    if (routeCount === 0) {
      console.log("Seeding Routes...");
      await Route.insertMany(sampleRoutes);
      console.log("Routes seeded.");
    } else {
      console.log(`Routes collection already has ${routeCount} documents. Skipping seed.`);
    }

    if (vehicleCount === 0) {
      console.log("Seeding Vehicles...");
      await Vehicle.insertMany(sampleVehicles);
      console.log("Vehicles seeded.");
    } else {
      console.log(`Vehicles collection already has ${vehicleCount} documents. Skipping seed.`);
    }

    console.log("Database seed completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
