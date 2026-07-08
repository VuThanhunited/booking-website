const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

//Lấy hotels theo thành phố
exports.countByCity = async (req, res) => {
  const BACKEND_BASE_URL = req.protocol + "://" + req.get("host");
  try {
    const cities = [
      {
        name: "Ha Noi",
        image: `${BACKEND_BASE_URL}/images/ha-noi.jpg`,
      },
      {
        name: "Ho Chi Minh",
        image: `${BACKEND_BASE_URL}/images/HCM.jpg`,
      },
      {
        name: "Da Nang",
        image: `${BACKEND_BASE_URL}/images/da-nang.jpg`,
      },
    ];
    const counts = await Promise.all(
      cities.map((city) =>
        Hotel.countDocuments({
          city: city.name,
        })
      )
    );

    const result = cities.map((city, i) => ({
      city: city.name,
      image: city.image,
      count: counts[i],
    }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Lấy theo loại
exports.countByType = async (req, res) => {
  try {
    const types = ["hotel", "apartment", "resort", "villa", "cabin"];
    const counts = await Promise.all(
      types.map((type) => Hotel.countDocuments({ type }))
    );
    res.json(types.map((type, i) => ({ type, count: counts[i] })));
  } catch (err) {
    res.status(500).json(err);
  }
};

//Lấy hotel có điểm số cao nhất
exports.getTopRated = async (req, res) => {
  try {
    const top = await Hotel.find({ isDeleted: false }).sort({ rating: -1 });
    res.json(top);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchHotels = async (req, res) => {
  const { city, startDate, endDate, room, min = 0, max = 9999 } = req.query;

  try {
    const hotels = await Hotel.find({
      city: { $regex: city, $options: "i" },
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const requestedRooms = parseInt(room);
    const availableHotels = [];

    for (const hotel of hotels) {
      if (!hotel.rooms || hotel.rooms.length === 0) continue;

      const roomIds = hotel.rooms.map((id) =>
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
      );

      const rooms = await Room.find({
        _id: { $in: roomIds },
        price: { $gte: parseInt(min), $lte: parseInt(max) },
      });

      let availableRoomCount = 0;

      for (const room of rooms) {
        const validRooms = room.roomNumber.filter(
          (roomNo) =>
            Array.isArray(roomNo.unavailableDates) &&
            roomNo.unavailableDates.every(
              (date) => new Date(date) < start || new Date(date) > end
            )
        );

        availableRoomCount += validRooms.length;
      }

      if (availableRoomCount >= requestedRooms) {
        availableHotels.push(hotel);
      }
    }

    res.status(200).json(availableHotels);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Lấy phòng phù hợp để đặt phòng
// exports.getAvailableRooms = async (req, res) => {
//   try {
//     const hotelId = req.params.id;
//     const { checkIn, checkOut } = req.query;

//     const start = new Date(checkIn);
//     const end = new Date(checkOut);

//     const hotel = await Hotel.findById(hotelId).populate("rooms");
//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }

//     const availableRooms = [];

//     for (const room of hotel.rooms) {
//       const isRoomAvailable = room.roomNumber.some((roomNo) => {
//         const dates = roomNo.unavailableDates || [];
//         return !dates.some(
//           (date) => new Date(date) >= start && new Date(date) <= end
//         );
//       });

//       if (isRoomAvailable) {
//         availableRooms.push({
//           _id: room._id,
//           title: room.title,
//           desc: room.desc,
//           price: room.price,
//           maxPeople: room.maxPeople,
//         });
//       }
//     }

//     res.status(200).json(availableRooms);
//   } catch (err) {
//     console.error("❌ Error fetching available rooms:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
exports.getAvailableRoomNumbers = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const hotelRaw = await Hotel.findById(req.params.id);
    if (!hotelRaw) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // ✅ Ép kiểu thủ công từ String → ObjectId nếu cần
    const roomIds = (hotelRaw.rooms || []).map((id) =>
      typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
    );

    // 🔄 Lấy danh sách phòng theo ID
    const rooms = await Room.find({ _id: { $in: roomIds } });

    const availableRooms = [];

    for (const room of rooms) {
      if (!Array.isArray(room.roomNumber)) continue;

      const availableRoomNumbers = room.roomNumber.filter((roomNo) => {
        const dates = Array.isArray(roomNo.unavailableDates)
          ? roomNo.unavailableDates
          : [];

        return dates.every(
          (d) => new Date(d) < startDate || new Date(d) > endDate
        );
      });

      if (availableRoomNumbers.length > 0) {
        availableRooms.push({
          _id: room._id,
          title: room.title,
          desc: room.desc,
          price: room.price,
          maxPeople: room.maxPeople,
          roomNumbers: availableRoomNumbers.map((r) => r.number),
        });
      }
    }

    res.status(200).json(availableRooms);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//admin page
//Tạo danh sách khách sạn
exports.createHotel = async (req, res) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Cập nhật danh sách khách sạn
exports.updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Xóa một khách sạn nào đó
exports.deleteHotel = async (req, res) => {
  try {
    const hotelId = new mongoose.Types.ObjectId(req.params.id); // convert String to ObjectId
    const transactions = await Transaction.find({ hotel: hotelId });

    if (transactions.length > 0) {
      return res.status(400).json("Hotel đang có giao dịch, không thể xóa!");
    }

    await Hotel.findByIdAndUpdate(hotelId, { isDeleted: true });
    res.status(200).json("Hotel đã được xóa!");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

//Lấy một khách sạn theo id
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Hiển thị toàn bộ khách sạn
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isDeleted: false });
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Thêm phòng vào danh sách rooms của khách sạn
exports.addRoomToHotel = async (req, res) => {
  try {
    const { hotelId, roomId } = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $addToSet: { rooms: roomId } }, // đảm bảo không thêm trùng
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updatedHotel);
  } catch (err) {
    console.error("Add room to hotel error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to update hotel", error: err.message });
  }
};
