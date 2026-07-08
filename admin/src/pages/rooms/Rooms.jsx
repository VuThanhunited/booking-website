import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./rooms.css";
import { useAdminAuth } from "../../context/AdminAuthContext";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/rooms`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa phòng này không?");
    if (!confirmDelete) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="roomListContainer">
      <div className="roomListTop">
        <h2>Rooms List</h2>
        <Link to="/newroom" className="addNewButton">
          Add New
        </Link>
      </div>
      <table className="roomTable">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>Room Types</th>
            <th>Description</th>
            <th>Price</th>
            <th>Max People</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{room._id}</td>
              <td>{room.title}</td>
              <td>{room.desc}</td>
              <td>{room.price}</td>
              <td>{room.maxPeople}</td>

              {/* Hiển thị tên khách sạn */}
              <td className="roomBtn">
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(room._id)}
                >
                  Delete
                </button>
                <button
                  className="editButton"
                  onClick={() => navigate(`/rooms/edit/${room._id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        1–{rooms.length} of {rooms.length}
      </div>
    </div>
  );
};

export default RoomList;
