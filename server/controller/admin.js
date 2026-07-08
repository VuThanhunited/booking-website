const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Transaction.countDocuments();
    const earnings = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const balance = earnings[0]?.total || 0;

    res.status(200).json({
      users: userCount,
      orders: orderCount,
      earnings: `$${balance}`,
      balance: `$${balance}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getLatestTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("hotel", "name")
      .populate("room", "title");

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
};
