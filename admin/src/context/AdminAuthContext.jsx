import { createContext, useState, useContext } from "react";
import { loginAdmin } from "../api/adminRequests";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const tokenKey = "adminToken";
  const storedToken = localStorage.getItem(tokenKey);
  const [token, setToken] = useState(storedToken || null);

  const login = async (creds) => {
    try {
      const res = await loginAdmin(creds);
      const tk = res.data?.token;

      if (!tk) {
        throw new Error("Không nhận được token từ server.");
      }

      localStorage.setItem(tokenKey, tk);
      setToken(tk);
      return res; // Trả về để frontend kiểm tra user, isAdmin,...
    } catch (err) {
      console.error("Lỗi đăng nhập:", err?.response?.data || err.message);
      throw err; // Cho phép handle lỗi ở nơi gọi login()
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
