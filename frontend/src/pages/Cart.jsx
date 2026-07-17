import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-emerald-600 font-medium">Browse products →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4">
            <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-slate-500">₹{item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="border rounded w-16 px-2 py-1"
            />
            <p className="w-24 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow p-4">
        <span className="text-lg font-bold">Total: ₹{totalPrice.toFixed(2)}</span>
        <button
          onClick={handleCheckout}
          className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
