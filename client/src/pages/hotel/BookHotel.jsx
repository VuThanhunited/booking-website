import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookHotel.css";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const BookHotel = ({ hotelId, hotelName }) => {
  const { user } = useContext(AuthContext);
  const { lang, t } = useLanguage();
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
      alert(lang === "vi" ? "Vui lòng điền đầy đủ thông tin đặt phòng." : "Please fill in all reservation details.");
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

      alert(lang === "vi" ? "Đặt phòng thành công! Email xác nhận đã được gửi." : "Booking successful! Confirmation email has been sent.");
      navigate("/transactions");
    } catch (err) {
      console.error("Lỗi khi đặt phòng:", err);
      alert(lang === "vi" ? "Có lỗi xảy ra khi đặt phòng." : "An error occurred while booking.");
    }
  };

  const nightText = lang === "vi" ? "đêm" : "night";
  const maxPeopleText = lang === "vi" ? "Tối đa" : "Max";
  const peopleText = lang === "vi" ? "người" : "people";
  const roomWord = lang === "vi" ? "Phòng" : "Room";
  const datesWord = lang === "vi" ? "Thời gian" : "Dates";
  const infoWord = lang === "vi" ? "Thông tin đặt phòng" : "Reserve Info";
  const totalWord = lang === "vi" ? "Tổng cộng" : "Total";

  const fields = [
    { name: "fullName", label: t("fullname") },
    { name: "email", label: t("emailAddress") },
    { name: "phoneNumber", label: t("phoneNumber") },
    { name: "identityCard", label: t("identityCard") },
    { name: "bank", label: t("bank") },
    { name: "bankAccountNumber", label: t("accountNumber") },
  ];

  return (
    <div className="booking-wrapper">
      <h2 className="hotel-title">{t("reserve")} - {hotelName}</h2>
      <div className="booking-container">
        <div className="left-section">
          <h3>{datesWord}</h3>
          <div className="date-picker-group">
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              placeholderText={lang === "vi" ? "Ngày nhận phòng" : "Check-in"}
              className="datepicker"
            />
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              placeholderText={lang === "vi" ? "Ngày trả phòng" : "Check-out"}
              className="datepicker"
            />
          </div>

          {availableRooms.length > 0 && <h3>{t("selectRooms")}</h3>}
          {availableRooms.map((room) => (
            <div key={room._id} className="room-card">
              <h4>{room.title}</h4>
              <p>
                ${room.price} / {nightText} – {maxPeopleText}: {room.maxPeople} {peopleText}
              </p>
              <div className="room-numbers">
                {room.roomNumbers.map((number) => {
                  const isChecked = selectedRoomNumbers.some(
                    (r) => r.roomId === room._id && r.number === number
                  );
                  return (
                    <label key={number} className="room-number-label">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRoomSelect(room._id, number)}
                      />
                      {roomWord} {number}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="right-section">
          <h3>{infoWord}</h3>
          {fields.map(({ name, label }) => (
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
          <div className="form-group">
            <label className="form-label">{t("payment")}</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="payment-select"
            >
              <option value="Credit Card">{t("creditCard")}</option>
              <option value="Cash">{t("cash")}</option>
            </select>
          </div>
          <h4 className="total-price">{totalWord}: ${totalPrice}</h4>
          <button onClick={handleReserve} className="reserve-button">
            {t("bookNow")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookHotel;
