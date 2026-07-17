import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { userInfo, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-tight">ShopEasy</Link>

      <div className="flex items-center gap-5 text-sm">
        <Link to="/" className="hover:text-emerald-400">Products</Link>

        {userInfo && userInfo.role === "admin" && (
          <>
            <Link to="/admin/products" className="hover:text-emerald-400">Manage Products</Link>
            <Link to="/admin/orders" className="hover:text-emerald-400">All Orders</Link>
          </>
        )}

        {userInfo && userInfo.role === "customer" && (
          <Link to="/my-orders" className="hover:text-emerald-400">My Orders</Link>
        )}

        <Link to="/cart" className="hover:text-emerald-400 relative">
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-emerald-500 text-xs rounded-full px-1.5">
              {totalItems}
            </span>
          )}
        </Link>

        {userInfo ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-300">Hi, {userInfo.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-emerald-400">Login</Link>
            <Link
              to="/register"
              className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
