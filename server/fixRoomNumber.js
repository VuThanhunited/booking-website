const mongoose = require("mongoose");
const Room = require("./models/Room");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const rooms = await Room.find();

  for (const room of rooms) {
    // chỉ cập nhật nếu rỗng hoặc sai định dạng
    if (!room.roomNumber || room.roomNumber.length === 0) {
      room.roomNumber = [
        { number: 101, unavailableDates: [] },
        { number: 102, unavailableDates: [] },
      ];
      await room.save();
      console.log(`✅ Updated room: ${room.title}`);
    }
  }

  console.log("✅ Tất cả roomNumber đã được cập nhật.");
  process.exit();
});
