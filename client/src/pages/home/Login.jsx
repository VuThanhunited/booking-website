import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./signup.module.css";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      if (!user || user.isDeleted || !user.isActive) {
        alert("Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.");
        navigate("/register");
        return;
      }

      dispatch({ type: "LOGIN", payload: user });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      if (err.response) {
        const status = err.response.status;

        if (status === 403 || status === 404) {
          alert("Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.");
          navigate("/register");
        } else if (status === 401) {
          alert("Sai mật khẩu.");
        } else {
          alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } else {
        alert("Không thể kết nối tới server.");
      }
    }
  };

  return (
    <div className={classes.content}>
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <h2>Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
