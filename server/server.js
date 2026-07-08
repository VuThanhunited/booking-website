const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotels");
const roomRoutes = require("./routes/rooms");
const txRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");
const usersRoutes = require("./routes/user");
const path = require("path");

dotenv.config();
const app = express();
connectDB();

// CORS configuration - update Vercel and Render URLs after deployment
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://booking-website-722d4.web.app",
  "https://booking-admin-1a8c2.web.app",
  "https://booking-website-drab-eight.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV === "production") {
        // Trong production, chỉ cho phép từ allowedOrigins
        callback(new Error("CORS not allowed"), false);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Xử lý preflight request (quan trọng)
app.options("*", cors());

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "data/city_image")));
app.use("/auth", authRoutes);
app.use("/hotels", hotelRoutes);
app.use("/rooms", roomRoutes);
app.use("/transactions", txRoutes);
app.use("/admin", adminRoutes);
app.use("/users", usersRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
