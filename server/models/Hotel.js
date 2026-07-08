const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    title: {
      type: String,
      required: true,
    },
    city: String,
    address: String,
    distance: String,
    photos: [String],
    desc: String,
    rating: { type: Number, min: 0, max: 5 },
    featured: { type: Boolean, default: false },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    cheapestPrice: { type: Number, required: true },
    availableRooms: Number,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", HotelSchema);
