import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import HotelList from "./pages/hotels/Hotels";
import NewHotel from "./pages/hotels/NewHotel";
import RoomList from "./pages/rooms/Rooms";
import NewRoom from "./pages/rooms/NewRoom";
import TransactionList from "./pages/transactions/Transactions";
import AdminLayout from "./components/AdminLayout";
import Users from "./pages/users/Users";

function ProtectedRoute({ children }) {
  const { token } = useAdminAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
const App = () => {
  return (
    <div className="adminApp">
      <div className="adminContent">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HotelList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/newhotel"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewHotel />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <RoomList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/newroom"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewRoom />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <TransactionList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hotels/edit/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewHotel />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/edit/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewRoom />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
