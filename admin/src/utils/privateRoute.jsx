import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function PrivateRoute() {
  const { token } = useAdminAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
}
