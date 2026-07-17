import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <img src={product.imageUrl} alt={product.name} className="rounded-lg w-full object-cover" />

      <div>
        <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
        <p className="text-slate-500 mb-2">{product.category}</p>
        <p className="text-2xl font-bold text-emerald-600 mb-4">₹{product.price.toFixed(2)}</p>
        <p className="text-slate-700 mb-4">{product.description}</p>
        <p className="mb-4 text-sm text-slate-500">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        {product.stock > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="border rounded w-20 px-2 py-1"
            />
          </div>
        )}

        <button
          disabled={product.stock === 0}
          onClick={() => {
            addToCart(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="bg-emerald-500 disabled:bg-slate-300 text-white px-5 py-2 rounded hover:bg-emerald-600 mr-3"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="border border-slate-300 px-5 py-2 rounded hover:bg-slate-100"
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
}
