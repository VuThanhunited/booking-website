const mongoose = require("mongoose");
require("dotenv").config();

const Room = require("./models/Room");
const Hotel = require("./models/Hotel");

const runFix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 MongoDB connected");

    const defaultHotel = await Hotel.findOne();
    if (!defaultHotel) {
      console.error("❌ Không tìm thấy khách sạn nào để lấy hotelId");
      return;
    }

    // ✅ 1. Cập nhật các room chưa có hotelId
    const roomsMissingHotel = await Room.find({ hotelId: { $exists: false } });

    if (roomsMissingHotel.length > 0) {
      console.log(
        `🔧 Cập nhật ${roomsMissingHotel.length} phòng thiếu hotelId...`
      );
      const hotelUpdates = roomsMissingHotel.map((room) =>
        Room.updateOne(
          { _id: room._id },
          { $set: { hotelId: defaultHotel._id } }
        )
      );
      await Promise.all(hotelUpdates);
      console.log("✅ Đã cập nhật hotelId cho các phòng thiếu.");
    } else {
      console.log("✅ Tất cả các phòng đã có hotelId.");
    }

    // ✅ 2. Cập nhật isDeleted: false cho các phòng chưa có trường này
    const result = await Room.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false } }
    );
    console.log(
      `✅ Đã cập nhật isDeleted: false cho ${result.modifiedCount} phòng.`
    );
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật:", err);
  } finally {
    mongoose.disconnect();
  }
};

runFix();
