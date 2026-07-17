import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Only lets logged-in ADMIN users through.
export default function AdminRoute() {
  const { userInfo } = useContext(AuthContext);
  if (!userInfo) return <Navigate to="/login" replace />;
  return userInfo.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}
