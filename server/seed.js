const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Hotel = require("./models/Hotel");
const Room = require("./models/Room");
const hotels = require("./data/hotels.json");
const rooms = require("./data/rooms.json");

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    console.log("🔁 Connected to DB. Cleaning old data...");

    await Room.deleteMany();
    await Hotel.deleteMany();

    // Tạo bản đồ ánh xạ từ roomId sang hotelId từ file hotels.json
    const roomToHotelMap = {};
    hotels.forEach((h) => {
      const hotelId = h._id?.$oid || h._id;
      let roomIds = [];
      if (Array.isArray(h.rooms)) {
        roomIds = h.rooms;
      } else if (typeof h.rooms === "string") {
        try {
          roomIds = h.rooms.replace(/[\[\]\s]/g, "").split(",");
        } catch (err) {}
      }
      roomIds.forEach((rid) => {
        roomToHotelMap[rid] = hotelId;
      });
    });

    console.log("📦 Inserting rooms...");
    const formattedRooms = rooms.map((r) => {
      const roomIdStr = r._id?.$oid || r._id;
      const hotelId = roomToHotelMap[roomIdStr];
      return {
        ...r,
        _id: new mongoose.Types.ObjectId(roomIdStr),
        hotelId: hotelId ? new mongoose.Types.ObjectId(hotelId) : undefined,
        createdAt: r.createdAt?.$date ? new Date(r.createdAt.$date) : undefined,
        updatedAt: r.updatedAt?.$date ? new Date(r.updatedAt.$date) : undefined,
      };
    });
    await Room.insertMany(formattedRooms);

    console.log("🏨 Inserting hotels...");
    const formattedHotels = hotels.map((h) => {
      // Chuyển rooms từ string sang array nếu cần
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

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    process.exit();
  }
};

runSeed();
