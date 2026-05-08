require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/transport_tracker";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Passenger User",
    email: "passenger@example.com",
    password: "passenger123",
    role: "passenger"
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        const user = new User(userData);
        await user.save();
        console.log(`User ${userData.email} created.`);
      } else {
        console.log(`User ${userData.email} already exists.`);
      }
    }

    console.log("User seeding completed.");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
