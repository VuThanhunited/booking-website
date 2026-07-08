const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    const existing = await User.findOne({ email: "admin@booking.com" });
    if (existing) {
      existing.isAdmin = true;
      existing.isDeleted = false;
      existing.isActive = true;
      await existing.save();
      console.log("Admin account already exists. Updated to admin successfully.");
    } else {
      const hash = await bcrypt.hash("admin", 10);
      const admin = new User({
        username: "admin",
        password: hash,
        email: "admin@booking.com",
        fullname: "System Administrator",
        phoneNumber: "1234567890",
        isAdmin: true,
      });
      await admin.save();
      console.log("Default admin account created: admin@booking.com / admin");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    process.exit(0);
  }
}

createAdmin();
