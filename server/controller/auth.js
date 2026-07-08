const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.register = async (req, res) => {
  const { username, password, fullName, phoneNumber, email } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hash,
    fullName,
    phoneNumber,
    email,
  });
  await user.save();
  res.status(201).json({ message: "Registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  if (!user || user.isDeleted)
    return res
      .status(404)
      .json({ user: null, message: "Không tìm thấy user." });

  if (!user.isActive)
    return res
      .status(403)
      .json({ user: null, message: "Tài khoản bị vô hiệu hóa." });

  const token = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
      isActive: user.isActive,
    },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
      isActive: user.isActive,
    },
  });
};
