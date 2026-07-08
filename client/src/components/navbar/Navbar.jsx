import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const VNFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="flagIcon">
    <circle cx="12" cy="12" r="10" fill="#da251d" />
    <polygon points="12,7 13.5,11.5 18,11.5 14.5,14 16,18.5 12,16 8,18.5 9.5,14 6,11.5 10.5,11.5" fill="#ffff00" />
  </svg>
);

const UKFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="flagIcon">
    <mask id="circleMask">
      <circle cx="12" cy="12" r="10" fill="white" />
    </mask>
    <g mask="url(#circleMask)">
      <rect width="24" height="24" fill="#00247d" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="white" strokeWidth="3" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#cf142b" strokeWidth="1.8" />
      <path d="M12,0 L12,24 M0,12 L24,12" stroke="white" strokeWidth="5" />
      <path d="M12,0 L12,24 M0,12 L24,12" stroke="#cf142b" strokeWidth="3" />
    </g>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="helpIcon">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { lang, changeLanguage, t } = useLanguage();
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

  const toggleLanguage = () => {
    changeLanguage(lang === "vi" ? "en" : "vi");
  };

  const navActions = (
    <div className="navActions">
      <span className="currencyText">VND</span>
      <div className="flagToggle" onClick={toggleLanguage}>
        {lang === "vi" ? <VNFlag /> : <UKFlag />}
      </div>
      <HelpIcon />
      <span className="listPropertyText" onClick={() => navigate("/")}>
        {t("listYourProperty")}
      </span>
    </div>
  );

  return (
    <div className="navbar">
      {user ? (
        <div className="navContainer">
          <span className="logo" onClick={() => navigate("/")}>
            {t("logo")}
          </span>
          <div className="navItems">
            {navActions}
            <span className="userEmail">{user.email}</span>
            <button className="navButton" onClick={handleTransaction}>
              {t("transactions")}
            </button>
            <button onClick={handleLogout} className="navButton">
              {t("logout")}
            </button>
          </div>
        </div>
      ) : (
        <div className="navContainer">
          <span className="logo" onClick={() => navigate("/")}>
            {t("logo")}
          </span>
          <div className="navItems">
            {navActions}
            <button className="navButton" onClick={handleRegister}>
              {t("signUp")}
            </button>
            <button className="navButton" onClick={handleLogin}>
              {t("login")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
