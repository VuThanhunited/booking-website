import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./newRoom.css";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotels, setHotels] = useState([]);
  const { token } = useAdminAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      if (id) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/rooms/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          const rawRoomNumber = (data.roomNumber || [])
            .map((r) => r.number)
            .join(", ");
          setInfo({ ...data, roomNumberRaw: rawRoomNumber });
        } catch (err) {
          console.error("Failed to fetch room:", err);
        }
      }
    };
    fetchRoom();
  }, [id, token]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/hotels`);
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      }
    };
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "roomNumber") {
      setInfo((prev) => ({ ...prev, roomNumberRaw: value }));
    } else {
      setInfo((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.REACT_APP_API_URL}/rooms/${id}`
        : `${process.env.REACT_APP_API_URL}/rooms`;

      const numbers = (info.roomNumberRaw || "")
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));

      const payload = {
        ...info,
        roomNumber: numbers.map((n) => ({ number: n })),
      };

      delete payload.roomNumberRaw;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const savedRoom = await res.json();

      // ✅ Chỉ cập nhật khách sạn khi tạo mới
      if (!id && info.hotelId) {
        await fetch(`${process.env.REACT_APP_API_URL}/hotels/add-room`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hotelId: info.hotelId,
            roomId: savedRoom._id,
          }),
        });
      }

      alert(id ? "Room updated successfully!" : "Room created successfully!");
      navigate("/rooms");
    } catch (err) {
      console.error(err);
      alert("Error submitting room data.");
    }
  };

  if (id && !info.title) {
    return <p style={{ padding: "20px" }}>Loading room data...</p>;
  }

  return (
    <div className="newRoomContainer">
      <div className="newRoomWrapper">
        <h2 className="newRoomTitle">{id ? "Edit Room" : "Add New Room"}</h2>
        <form className="newRoomForm" onSubmit={handleSubmit}>
          <div className="newRoomItem">
            <label>Title</label>
            <input
              id="title"
              type="text"
              value={info.title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newRoomItem">
            <label>Room Numbers (comma-separated)</label>
            <input
              id="roomNumber"
              type="text"
              placeholder="e.g. 101, 102, 103"
              value={info.roomNumberRaw || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newRoomItem">
            <label>Description</label>
            <textarea
              id="desc"
              value={info.desc || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newRoomItem">
            <label>Price</label>
            <input
              id="price"
              type="number"
              value={info.price || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newRoomItem">
            <label>Max People</label>
            <input
              id="maxPeople"
              type="number"
              value={info.maxPeople || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newRoomItem">
            <label>Hotel</label>
            <select
              id="hotelId"
              value={info.hotelId || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Hotel --</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <button className="newRoomButton" type="submit">
            {id ? "Update" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRoom;
