const mongoose = require("mongoose");
const Hotel = require("./models/Hotel");
require("dotenv").config(); // <-- Nạp biến môi trường từ .env

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công.");
    return updateHotels();
  })
  .catch((err) => {
    console.error("❌ Không thể kết nối MongoDB:", err.message);
    process.exit(1);
  });

async function updateHotels() {
  try {
    await Hotel.updateMany({}, { $set: { isDeleted: false } });
    console.log("✅ Tất cả khách sạn đã được cập nhật isDeleted = false");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật:", err);
    process.exit(1);
  }
}
