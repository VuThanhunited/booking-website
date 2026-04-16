import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookHotel.css";
import { AuthContext } from "../../context/AuthContext";

const BookHotel = ({ hotelId, hotelName }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    identityCard: user?.identityCard || "",
    bank: "",
    bankAccountNumber: "",
  });
  const [payment, setPayment] = useState("Credit Card");

  useEffect(() => {
    if (checkIn && checkOut) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/hotels/${hotelId}/available-rooms`,
          {
            params: {
              start: checkIn.toISOString(),
              end: checkOut.toISOString(),
            },
          }
        )
        .then((res) => setAvailableRooms(res.data))
        .catch(console.error);
    }
  }, [checkIn, checkOut, hotelId]);

  const totalNights =
    checkIn && checkOut
      ? Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24))
      : 0;

  const totalPrice =
    selectedRoomNumbers.reduce((sum, sel) => {
      const room = availableRooms.find((r) => r._id === sel.roomId);
      return room ? sum + room.price : sum;
    }, 0) * totalNights;

  const handleRoomSelect = (roomId, number) => {
    const exists = selectedRoomNumbers.some(
      (r) => r.roomId === roomId && r.number === number
    );
    if (exists) {
      setSelectedRoomNumbers((prev) =>
        prev.filter((r) => !(r.roomId === roomId && r.number === number))
      );
    } else {
      setSelectedRoomNumbers((prev) => [...prev, { roomId, number }]);
    }
  };

  const handleReserve = async () => {
    if (!checkIn || !checkOut || selectedRoomNumbers.length === 0) {
      alert("Please fill in all reservation details.");
      return;
    }

    const roomIds = [...new Set(selectedRoomNumbers.map((r) => r.roomId))];
    const roomTitles = [
      ...new Set(
        roomIds.map(
          (id) => availableRooms.find((r) => r._id === id)?.title || ""
        )
      ),
    ];

    const reservationData = {
      user: user.id,
      hotel: hotelId,
      room: roomIds,
      roomTitles,
      roomNumbers: selectedRoomNumbers,
      dateStart: checkIn,
      dateEnd: checkOut,
      totalPrice,
      payment,
      status: "Booked",
      ...formData,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        reservationData
      );

      for (const { roomId, number } of selectedRoomNumbers) {
        await axios.post(`${process.env.REACT_APP_API_URL}/rooms/reserve`, {
          fullName: formData.fullName,
          email: formData.email,
          roomId,
          number,
          checkIn,
          checkOut,
          hotelId, // ✅ THÊM DÒNG NÀY
          hotelName, // ✅ NẾU SERVER CŨNG CẦN
        });
      }

      alert("Đặt phòng thành công!");
      navigate("/transactions");
    } catch (err) {
      console.error("Lỗi khi đặt phòng:", err);
      alert("Có lỗi xảy ra khi đặt phòng.");
    }
  };

  return (
    <div className="booking-wrapper">
      <h2 className="hotel-title">Reserve Your Stay</h2>
      <div className="booking-container">
        <div className="left-section">
          <h3>Dates</h3>
          <div className="date-picker-group">
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              placeholderText="Check-in"
              className="datepicker"
            />
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              placeholderText="Check-out"
              className="datepicker"
            />
          </div>

          {availableRooms.map((room) => (
            <div key={room._id}>
              <h3>Select Rooms</h3>
              <div key={room._id} className="room-card">
                <h4>{room.title}</h4>
                <p>
                  ${room.price} / night – Max: {room.maxPeople} people
                </p>
                <div className="room-numbers">
                  {room.roomNumbers.map((number) => {
                    const isChecked = selectedRoomNumbers.some(
                      (r) => r.roomId === room._id && r.number === number
                    );
                    return (
                      <label key={number} className="room-checkbox">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRoomSelect(room._id, number)}
                        />
                        Room {number}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="right-section">
          <h3>Reserve Info</h3>
          {[
            { name: "fullName", label: "Full Name" },
            { name: "email", label: "Email" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "identityCard", label: "Identity Card" },
            { name: "bank", label: "Bank" },
            { name: "bankAccountNumber", label: "Bank Account Number" },
          ].map(({ name, label }) => (
            <div key={name} className="form-group">
              <input
                type="text"
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={(e) =>
                  setFormData({ ...formData, [name]: e.target.value })
                }
                className="info-input"
              />
            </div>
          ))}
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="payment-select"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Momo">Momo</option>
            <option value="Cash">Cash</option>
            <option value="Transfer">Bank Transfer</option>
          </select>
          <h4 className="total-price">Total: ${totalPrice}</h4>
          <button onClick={handleReserve} className="reserve-button">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookHotel;
