import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(credentials);
      const user = res.data?.user;

      console.log("User response:", user);

      if (!user) {
        alert(res.data.message || "Tài khoản không tồn tại.");
        return;
      }

      if (user.isDeleted) {
        alert("Tài khoản đã bị xóa.");
        return;
      }

      if (!user.isActive) {
        alert("Tài khoản đã bị vô hiệu hóa.");
        return;
      }

      if (!user.isAdmin) {
        alert("Bạn không có quyền Admin.");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          className="loginInput"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          className="loginInput"
        />
        <button onClick={handleLogin} className="loginButton">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
