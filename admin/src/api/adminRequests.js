import axios from "axios";

const API = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}` });

// Auth
export const loginAdmin = (creds) => API.post("/auth/login", creds);

// Dashboard
export const fetchDashboard = () => API.get("/admin/dashboard");

// Hotels
export const getHotels = () => API.get("/hotels");
export const createHotel = (hotel) => API.post("/hotels", hotel);
export const deleteHotel = (id) => API.delete(`/hotels/${id}`);

// Rooms
export const getRooms = () => API.get("/rooms");
export const createRoom = (room) => API.post("/rooms", room);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Transactions
export const getTransactions = () => API.get("/transactions");
