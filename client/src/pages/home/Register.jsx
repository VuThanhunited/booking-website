import React, { useState } from "react";
import axios from "axios";
import classes from "./signup.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useLanguage } from "../../context/LanguageContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();
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
    <div>
      <Navbar />
      <div className={classes.content}>
        <form onSubmit={handleSignup} className={classes.formContainer}>
          <h2>{t("signUpTitle")}</h2>
          <p className={classes.subtitle}>{t("createAccountDesc")}</p>
          <input
            name="username"
            placeholder={t("username")}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            name="phoneNumber"
            placeholder={t("phoneNumber")}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            name="email"
            placeholder={t("emailAddress")}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            name="password"
            type="password"
            placeholder={t("password")}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{t("createAccountBtn")}</button>
          <p className={classes.toggleText}>
            {t("alreadyHaveAccount")}{" "}
            <span onClick={() => navigate("/login")}>{t("login")}</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
