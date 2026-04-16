import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./hotels.css";
import { useAdminAuth } from "../../context/AdminAuthContext";

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/hotels`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotels();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa hotel này không?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/hotels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setHotels(hotels.filter((hotel) => hotel._id !== id));
      } else {
        alert(result); // Ví dụ: "Hotel đang có giao dịch, không thể xóa!"
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <div className="hotelListContainer">
        <div className="hotelListTop">
          <h2>Hotels List</h2>
          <Link to="/newhotel" className="addNewButton">
            Add New
          </Link>
        </div>
        <table className="hotelTable">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Title</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{hotel._id}</td>
                <td>{hotel.name}</td>
                <td>{hotel.type}</td>
                <td>{hotel.title}</td>
                <td>{hotel.city}</td>
                <td>
                  <button
                    className="deleteButton"
                    onClick={() => handleDelete(hotel._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="editButton"
                    onClick={() => navigate(`/hotels/edit/${hotel._id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelList;
