const Room = require("../models/Room");
const Transaction = require("../models/Transaction");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Trả danh sách phòng kèm thông tin khách sạn (chỉ lấy phòng chưa bị xoá)
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isDeleted: false }).populate(
      "hotelId",
      "name"
    );
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Tạo phòng mới
exports.createRoom = async (req, res) => {
  const saved = await new Room(req.body).save();
  res.status(201).json(saved);
};

// ✅ Xoá mềm phòng (chỉ cập nhật isDeleted: true)
exports.deleteRoom = async (req, res) => {
  const inTx = await Transaction.exists({ rooms: req.params.id });
  if (inTx) return res.status(400).json({ message: "Has bookings" });

  await Room.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: "Room marked as deleted (soft delete)" });
};

// ✅ Lấy 1 phòng (bao gồm cả bị xoá)
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotelId", "name");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch room", error: err });
  }
};

// ✅ Cập nhật tình trạng ngày không khả dụng
exports.updateRoomAvailability = async (req, res) => {
  const { dates } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.roomNumber = room.roomNumber.map((roomNo) => ({
      ...roomNo,
      unavailableDates: [...(roomNo.unavailableDates || []), ...dates],
    }));

    await room.save();
    res.status(200).json("Room availability updated");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update availability", error: err });
  }
};

// ✅ Đặt phòng và gửi email xác nhận
exports.reserveRoomAndSendEmail = async (req, res) => {
  const { fullName, email, roomId, checkIn, checkOut } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room || room.isDeleted)
      return res
        .status(404)
        .json({ message: "Room not found or has been deleted" });

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const getDateRange = (start, end) => {
      const date = new Date(start);
      const dates = [];
      while (date <= end) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    };
    const dateRange = getDateRange(start, end);

    const availableRoom = room.roomNumber.find((roomNo) => {
      const unavailable = roomNo.unavailableDates || [];
      const overlap = dateRange.some((d) =>
        unavailable.some(
          (ex) => new Date(ex).toDateString() === new Date(d).toDateString()
        )
      );
      return !overlap;
    });

    if (!availableRoom) {
      return res.status(400).json({ message: "No available room" });
    }

    const totalNights = Math.ceil((end - start) / (1000 * 3600 * 24));
    const totalPrice = totalNights * room.price;

    availableRoom.unavailableDates = [
      ...(availableRoom.unavailableDates || []),
      ...dateRange,
    ];

    if (!room.hotelId) {
      return res.status(400).json({ message: "Room is missing hotelId" });
    }

    await room.save();

    const formattedStart = start.toLocaleDateString();
    const formattedEnd = end.toLocaleDateString();

    const emailBody = `
      <h2 style="color: green;">✅ Đặt phòng thành công!</h2>
      <p>Chào <strong>${fullName}</strong>,</p>
      <p>Bạn đã đặt phòng <strong>${room.title}</strong> thành công. Dưới đây là thông tin đơn đặt:</p>

      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>Họ tên</th>
            <th>Phòng</th>
            <th>Email</th>
            <th>Ngày nhận</th>
            <th>Ngày trả</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${fullName}</td>
            <td>${availableRoom.number}</td>
            <td>${email}</td>
            <td>${formattedStart}</td>
            <td>${formattedEnd}</td>
            <td>$${totalPrice}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Xác nhận đặt phòng thành công",
      html: emailBody,
    });

    res.status(200).json({ message: "Xác nhận đặt phòng đã được gửi." });
  } catch (err) {
    console.error("❌ Đặt phòng lỗi:", err);
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

// ✅ Cập nhật thông tin phòng
exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Lấy 1 phòng với thông tin khách sạn
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotelId", "name");
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Lấy toàn bộ phòng cho admin (chỉ hiển thị phòng chưa bị xoá)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isDeleted: false }).populate(
      "hotelId",
      "name"
    );
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
};
