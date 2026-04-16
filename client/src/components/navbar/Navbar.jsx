import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    navigate("/transactions");
  };

  return (
    <div className="navbar">
      {user ? (
        <div className="navContainer">
          <span className="logo">Booking Website</span>
          <div className="navItems">
            <span className="userEmail">{user.email}</span>
            <button className="navButton" onClick={handleTransaction}>
              Transactions
            </button>
            <button onClick={handleLogout} className="navButton">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="navContainer">
          <span className="logo">Booking Website</span>
          <div className="navItems">
            <button className="navButton" onClick={handleRegister}>
              Sign Up
            </button>
            <button className="navButton" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
