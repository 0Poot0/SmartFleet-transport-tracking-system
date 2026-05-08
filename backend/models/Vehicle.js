const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    plateNumber: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);

