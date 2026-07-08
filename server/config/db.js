const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error("ERROR: MONGO_URI environment variable is not set!");
    process.exit(1);
  }
  
  console.log("🔌 Connecting to remote MongoDB Atlas...");
  
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of waiting indefinitely
    });
    console.log("✓ MongoDB connected successfully");
  } catch (err) {
    console.warn("✗ Remote DB connection failed:", err.message);
    console.log("⚡ Attempting fallback to local In-Memory MongoDB Server...");
    
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      console.log(`🔗 In-Memory MongoDB URI: ${memoryUri}`);
      await mongoose.connect(memoryUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✓ In-Memory MongoDB connected successfully");
      
      // Auto seed initial data since memory server starts completely empty
      const Hotel = require("../models/Hotel");
      const hotelCount = await Hotel.countDocuments();
      if (hotelCount === 0) {
        console.log("📦 In-Memory database is empty. Running database seed...");
        await seedMemoryDatabase();
      }
      
    } catch (fallbackErr) {
      console.error("✗ Failed to start In-Memory MongoDB:", fallbackErr.message);
      process.exit(1);
    }
  }
}

// Helper to seed memory DB using hotels.json and rooms.json
async function seedMemoryDatabase() {
  try {
    const Hotel = require("../models/Hotel");
    const Room = require("../models/Room");
    const User = require("../models/User");
    const hotels = require("../data/hotels.json");
    const rooms = require("../data/rooms.json");
    const bcrypt = require("bcryptjs");

    const formattedRooms = rooms.map((r) => ({
      ...r,
      _id: new mongoose.Types.ObjectId(r._id?.$oid || r._id),
      createdAt: r.createdAt?.$date ? new Date(r.createdAt.$date) : undefined,
      updatedAt: r.updatedAt?.$date ? new Date(r.updatedAt.$date) : undefined,
    }));
    await Room.insertMany(formattedRooms);

    const formattedHotels = hotels.map((h) => {
      let roomArray = [];
      if (Array.isArray(h.rooms)) {
        roomArray = h.rooms.map((id) => new mongoose.Types.ObjectId(id));
      } else if (typeof h.rooms === "string") {
        try {
          const rawString = h.rooms.replace(/[\[\]\s]/g, "").split(",");
          roomArray = rawString.map((id) => new mongoose.Types.ObjectId(id));
        } catch (err) {
          console.warn("⚠️ Cannot parse rooms for hotel:", h.name);
        }
      }

      return {
        ...h,
        _id: new mongoose.Types.ObjectId(h._id?.$oid || h._id),
        rooms: roomArray,
      };
    });
    await Hotel.insertMany(formattedHotels);
    
    // Create default test accounts
    const adminHash = await bcrypt.hash("admin", 10);
    const adminUser = new User({
      username: "admin",
      password: adminHash,
      email: "admin@booking.com",
      fullname: "System Administrator",
      isAdmin: true,
    });
    await adminUser.save();
    
    const userHash = await bcrypt.hash("user", 10);
    const regularUser = new User({
      username: "user",
      password: userHash,
      email: "user@booking.com",
      fullname: "John Doe",
      isAdmin: false,
    });
    await regularUser.save();
    
    console.log("✅ Seeded In-Memory database with initial hotels, rooms, and test users (admin@booking.com / admin, user@booking.com / user)!");
  } catch (seedErr) {
    console.error("✗ Failed to seed In-Memory database:", seedErr.message);
  }
}

module.exports = connectDB;
