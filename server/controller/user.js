const User = require("../models/User");

// Lấy danh sách user chưa bị xóa
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// "Xóa mềm" user
exports.softDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json("User đã được ẩn.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Toggle trạng thái hoạt động
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isActive });
    res.status(200).json("Cập nhật trạng thái thành công.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// // Đăng nhập kiểm tra trạng thái (dùng email)
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || user.isDeleted)
//       return res
//         .status(404)
//         .json({ user: null, message: "Không tìm thấy user." });

//     if (!user.isActive)
//       return res
//         .status(403)
//         .json({ user: null, message: "Tài khoản bị vô hiệu hóa." });

//     if (user.password !== password)
//       return res.status(401).json({ user: null, message: "Sai mật khẩu." });

//     // Trả về thông tin đầy đủ cho frontend kiểm tra
//     res.status(200).json({
//       token: "fake-jwt-token",
//       user: {
//         id: user._id,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         isActive: user.isActive,
//         isDeleted: user.isDeleted,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server." });
//   }
// };
