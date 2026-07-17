import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ address: "", city: "", postalCode: "", country: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const { data } = await api.post("/orders", { orderItems, shippingAddress: form });
      clearCart();
      navigate(`/my-orders/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Checkout</h1>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={placeOrder} className="flex flex-col gap-4 bg-white rounded-lg shadow p-6">
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="border rounded px-3 py-2" />

        <div className="flex justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        <button
          disabled={loading}
          className="bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
