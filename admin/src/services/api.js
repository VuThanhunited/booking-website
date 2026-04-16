import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/admin`,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginAdmin = (credentials) => API.post("/auth/login", credentials);
export const fetchStats = async () => {
  try {
    return await API.get("/stats");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const fetchHotels = async () => {
  try {
    return await API.get("/hotels");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteHotel = async (id) => {
  try {
    return await API.delete(`/hotels/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createHotel = (data) => API.post("/hotels", data);
export const fetchRooms = async () => {
  try {
    return await API.get("/rooms");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteRoom = async (id) => {
  try {
    return await API.delete(`/rooms/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createRoom = (data) => API.post("/rooms", data);
export const fetchTransactions = async () => {
  try {
    return await API.get("/transactions");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const isAdminLoggedIn = () =>
  Boolean(localStorage.getItem("adminToken"));
