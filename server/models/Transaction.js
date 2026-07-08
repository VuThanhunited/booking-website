const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  room: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  roomTitles: [String], // Thêm trường này
  roomNumbers: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
    },
  ],
  dateStart: Date,
  dateEnd: Date,
  totalPrice: Number,
  payment: String,
  status: String,
  fullName: String,
  email: String,
  phoneNumber: String,
  identityCard: String,
  bank: String,
  bankAccountNumber: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
