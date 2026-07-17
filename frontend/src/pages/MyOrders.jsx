import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && <p className="text-slate-500">You haven't placed any orders yet.</p>}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/my-orders/${order.id}`}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md"
          >
            <div>
              <p className="font-medium">Order #{order.id.slice(-6)}</p>
              <p className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleDateString()} — ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
