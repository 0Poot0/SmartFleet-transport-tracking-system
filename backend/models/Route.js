const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    stops: { type: [String], default: [] },
    description: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);

