import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!order) return null;

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-2">Order #{order.id.slice(-6)}</h1>
      <p className="text-sm text-slate-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* Order tracking progress bar */}
      {order.status !== "Cancelled" ? (
        <div className="flex items-center mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  i <= currentStep ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs mt-1 text-center">{step}</span>
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 ${
                    i < currentStep ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-red-600 font-semibold">This order was cancelled.</p>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-slate-600">
          {order.address}, {order.city}, {order.postalCode}, {order.country}
        </p>
        <p className="text-sm text-slate-600">Phone: {order.phone}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t mt-2 pt-2">
          <span>Total</span>
          <span>₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
