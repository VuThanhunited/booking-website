import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Register from "./pages/home/Register";
import Login from "./pages/home/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Transactions from "./pages/TransactionDashboard/TransactionDashboard";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/transactions" element={<Transactions user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
