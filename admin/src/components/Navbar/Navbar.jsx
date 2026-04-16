import React from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { logout } = useAdminAuth();
  const nav = useNavigate();
  const onLogout = () => {
    logout();
    nav("/login");
  };
  return (
    <div className="navbar">
      <button onClick={() => nav("/transactions")}>Transactions</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
