import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-40 w-full object-cover rounded mb-3"
      />
      <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
      <p className="text-sm text-slate-500 mb-2">{product.category}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-emerald-600">₹{product.price.toFixed(2)}</span>
        <span className={`text-xs ${product.stock > 0 ? "text-slate-500" : "text-red-500"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>
    </Link>
  );
}
