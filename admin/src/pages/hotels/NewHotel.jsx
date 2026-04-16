import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./newHotel.css";

const NewHotel = () => {
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const { token } = useAdminAuth();
  const { id } = useParams(); // hotel ID từ URL
  const navigate = useNavigate();

  // Lấy danh sách phòng từ server
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/rooms`);
        const data = await res.json();
        console.log(data);
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // Nếu đang edit, fetch thông tin khách sạn
  useEffect(() => {
    const fetchHotel = async () => {
      if (id) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/hotels/${id}`
          );
          const data = await res.json();

          setInfo({
            ...data,
            rooms: data.rooms?.map((r) => r.toString()) || [],
          });
        } catch (err) {
          console.error("Failed to fetch hotel:", err);
        }
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "featured") {
      setInfo((prev) => ({ ...prev, [id]: value === "true" }));
    } else if (id === "photos") {
      setInfo((prev) => ({
        ...prev,
        photos: value.split(",").map((url) => url.trim()),
      }));
    } else if (id === "rooms") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setInfo((prev) => ({ ...prev, rooms: selectedOptions }));
    } else {
      setInfo((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.REACT_APP_API_URL}/hotels/${id}`
        : `${process.env.REACT_APP_API_URL}/hotels`;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(info),
      });

      alert(id ? "Hotel updated successfully!" : "Hotel created successfully!");
      navigate("/hotels");
    } catch (err) {
      console.error(err);
      alert("Error submitting hotel data.");
    }
  };

  if (id && !info.name)
    return <p style={{ padding: "20px" }}>Loading hotel data...</p>;

  return (
    <div className="newHotelContainer">
      <div className="newHotelWrapper">
        <h2 className="newHotelTitle">{id ? "Edit Hotel" : "Add New Hotel"}</h2>
        <form className="newHotelForm" onSubmit={handleSubmit}>
          <div className="newHotelItem">
            <label>Name</label>
            <input
              id="name"
              value={info.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Type</label>
            <input
              id="type"
              value={info.type || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>City</label>
            <input
              id="city"
              value={info.city || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Address</label>
            <input
              id="address"
              value={info.address || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Distance from City Center (meters)</label>
            <input
              id="distance"
              value={info.distance || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Title</label>
            <input
              id="title"
              value={info.title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newHotelItem">
            <label>Cheapest Price</label>
            <textarea
              id="cheapestPrice"
              type="number"
              value={info.cheapestPrice || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newHotelItem">
            <label>Description</label>
            <textarea
              id="desc"
              value={info.desc || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Rating</label>
            <textarea
              id="rating"
              value={info.rating || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="newHotelItem">
            <label>Featured</label>
            <select
              id="featured"
              value={info.featured ? "true" : "false"}
              onChange={handleChange}
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="newHotelItem">
            <label>Images (comma-separated URLs)</label>
            <textarea
              id="photos"
              value={info.photos?.join(", ") || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="newHotelItem">
            <label>Rooms</label>
            <select
              id="rooms"
              multiple
              value={info.rooms || []}
              onChange={handleChange}
              required
            >
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.title}
                </option>
              ))}
            </select>
          </div>

          <button className="newHotelButton" type="submit">
            {id ? "Update" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewHotel;
