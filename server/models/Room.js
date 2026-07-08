const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    maxPeople: Number,
    desc: String,
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: false,
    },
    roomNumber: [{ number: Number, unavailableDates: { type: [Date] } }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
