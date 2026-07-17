import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Only lets logged-in users through. Otherwise redirects to /login.
export default function PrivateRoute() {
  const { userInfo } = useContext(AuthContext);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}
