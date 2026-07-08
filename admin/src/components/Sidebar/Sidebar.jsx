import "./sidebar.css";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdPersonOutline,
  MdHotel,
  MdMeetingRoom,
  MdPayment,
  MdAddBusiness,
  MdOutlineMeetingRoom,
  MdLogout,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth(); // lấy logout từ context

  const handleLogout = () => {
    logout(); // xóa token + cập nhật state
    navigate("/login"); // chuyển về login
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" className="logo">
          Admin Page
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <MdDashboard className="icon" />
            <Link to="/">Dashboard</Link>
          </li>
          <p className="title">LISTS</p>
          <li>
            <MdPersonOutline className="icon" />
            <Link to="/users">Users</Link>
          </li>
          <li>
            <MdHotel className="icon" />
            <Link to="/hotels">Hotels</Link>
          </li>
          <li>
            <MdMeetingRoom className="icon" />
            <Link to="/rooms">Rooms</Link>
          </li>
          <li>
            <MdPayment className="icon" />
            <Link to="/transactions">Transactions</Link>
          </li>
          <p className="title">NEW</p>
          <li>
            <MdAddBusiness className="icon" />
            <Link to="/newhotel">New Hotel</Link>
          </li>
          <li>
            <MdOutlineMeetingRoom className="icon" />
            <Link to="/newroom">New Room</Link>
          </li>
          <p className="title">USER</p>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <MdLogout className="icon" />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
