import React, { useState } from "react";
import axios from "axios";
import classes from "./signup.module.css"; // giữ nguyên file CSS nếu bạn đã có
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        phoneNumber,
        email,
        password,
      });
      alert("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      alert(
        "Đăng ký lỗi: " + (err.response?.data?.message || "Không xác định")
      );
    }
  };

  return (
    <div className={classes.content}>
      <form onSubmit={handleSignup} className={classes.formContainer}>
        <h2>Sign Up</h2>
        <input
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Register;
