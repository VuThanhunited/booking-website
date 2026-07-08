import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./signup.module.css";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const { t } = useLanguage();
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
    <div>
      <Navbar />
      <div className={classes.content}>
        <form onSubmit={handleSubmit} className={classes.formContainer}>
          <h2>{t("signInTitle")}</h2>
          <p className={classes.subtitle}>{t("welcomeBack")}</p>
          <input
            name="email"
            placeholder={t("emailAddress")}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("password")}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{t("loginBtn")}</button>
          <p className={classes.toggleText}>
            {t("dontHaveAccount")}{" "}
            <span onClick={() => navigate("/register")}>{t("signUp")}</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
