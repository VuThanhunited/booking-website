const Transaction = require("../models/Transaction");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const sendEmail = require("../utils/sendEmail");

exports.createTransaction = async (req, res) => {
  const {
    user,
    hotel,
    room,
    roomNumbers, // ✅ Nhận thêm roomNumbers
    dateStart,
    dateEnd,
    totalPrice,
    payment,
    status,
    fullName,
    email,
    phoneNumber,
    identityCard,
    bank,
    bankAccountNumber,
  } = req.body;

  console.log("➡️  Transaction request body:", req.body); // ✅ Log đầu vào

  try {
    // Lấy tiêu đề phòng từ roomIds
    const roomDocs = await Room.find({ _id: { $in: room } });
    const roomTitles = roomDocs.map((r) => r.title);

    // Lấy thông tin khách sạn
    const hotelDoc = await Hotel.findById(hotel);
    const hotelName = hotelDoc ? hotelDoc.name : "Khách sạn";

    const newTransaction = new Transaction({
      user,
      hotel,
      room,
      roomTitles,
      roomNumbers, // ✅ Lưu số phòng cụ thể đã chọn
      dateStart,
      dateEnd,
      totalPrice,
      payment,
      status,
      fullName,
      email,
      phoneNumber,
      identityCard,
      bank,
      bankAccountNumber,
    });

    await newTransaction.save();

    // Tính tất cả ngày trong khoảng đặt phòng
    const allDates = getDatesInRange(new Date(dateStart), new Date(dateEnd));

    // ✅ Cập nhật unavailableDates chính xác theo từng roomId và number
    for (const { roomId, number } of roomNumbers) {
      const roomDoc = await Room.findById(roomId);
      if (!roomDoc) continue;

      const roomNo = roomDoc.roomNumber.find((r) => r.number === number);
      if (!roomNo) continue;

      roomNo.unavailableDates = [
        ...(roomNo.unavailableDates || []),
        ...allDates,
      ];

      await Room.updateOne(
        { _id: roomId, "roomNumber.number": number },
        { $set: { "roomNumber.$.unavailableDates": roomNo.unavailableDates } }
      );
    }

    // ✅ Gửi một email xác nhận duy nhất cho toàn bộ giao dịch đặt phòng
    const formattedStart = new Date(dateStart).toLocaleDateString();
    const formattedEnd = new Date(dateEnd).toLocaleDateString();
    const roomNumbersList = roomNumbers.map((rn) => rn.number).join(", ");
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center; border-bottom: 2px solid #003580; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #003580; margin: 0;">Đặt Phòng Thành Công!</h2>
          <p style="color: #666; margin: 5px 0 0 0;">Mã đơn: <strong>${newTransaction._id}</strong></p>
        </div>
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>Cảm ơn bạn đã đặt phòng với chúng tôi. Dưới đây là thông tin chi tiết đơn đặt phòng tại <strong>${hotelName}</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; width: 40%; color: #555;">Khách sạn:</td>
            <td style="padding: 12px; color: #333;">${hotelName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Họ tên khách:</td>
            <td style="padding: 12px; color: #333;">${fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Số điện thoại:</td>
            <td style="padding: 12px; color: #333;">${phoneNumber}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Ngày lưu trú:</td>
            <td style="padding: 12px; color: #333;">${formattedStart} - ${formattedEnd}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Loại phòng:</td>
            <td style="padding: 12px; color: #333;">${roomTitles.join(", ")} (Số phòng: ${roomNumbersList})</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Thanh toán:</td>
            <td style="padding: 12px; color: #333;">${payment}</td>
          </tr>
          <tr style="background-color: #e6f7ff; font-size: 1.1em; font-weight: bold;">
            <td style="padding: 12px; color: #003580;">Tổng chi phí:</td>
            <td style="padding: 12px; color: #e02020;">$${totalPrice}</td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 0.9em; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          Nếu bạn cần bất cứ sự trợ giúp nào khác, hãy liên hệ ngay với chúng tôi.<br>
          Chúc bạn có một kỳ nghỉ thật vui vẻ!
        </p>
      </div>
    `;

    try {
      await sendEmail(email, "✅ Xác nhận đặt phòng thành công", emailBody);
      console.log("✉️ Booking confirmation email sent to:", email);
    } catch (mailErr) {
      console.error("❌ Failed to send booking confirmation email:", mailErr.message);
    }

    res.status(200).json("Booking successful!");
  } catch (err) {
    console.error("❌ Lỗi khi tạo transaction:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

function getDatesInRange(start, end) {
  const date = new Date(start);
  const dates = [];
  while (date <= end) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

exports.getUserTransactions = async (req, res) => {
  const userId = req.params.userId;
  try {
    const transactions = await Transaction.find({ user: userId })
      .populate({ path: "hotel", select: "name" })
      .populate({ path: "room", select: "title" });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({ path: "hotel", select: "name" })
      .populate({ path: "room", select: "title" });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: "Canceled" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: /transactions/canceled
exports.deleteCanceledTransactions = async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ status: "Canceled" });
    res.status(200).json({ message: "Deleted", count: result.deletedCount });
  } catch (err) {
    res.status(500).json(err);
  }
};
