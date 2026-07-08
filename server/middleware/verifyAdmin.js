const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("Bạn chưa đăng nhập!");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json("Token không hợp lệ!");

    const dbUser = await User.findById(user.id);
    if (!dbUser.isAdmin) {
      return res.status(403).json("Bạn không có quyền Admin!");
    }

    req.user = dbUser;
    next();
  });
};
