import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = { name: "", description: "", price: "", category: "", imageUrl: "", stock: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await api.get("/products");
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl,
      stock: p.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 grid sm:grid-cols-2 gap-4 mb-8">
        <h2 className="sm:col-span-2 font-semibold">{editingId ? "Edit Product" : "Add New Product"}</h2>
        {error && <p className="sm:col-span-2 text-red-500 text-sm">{error}</p>}

        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="stock" type="number" placeholder="Stock quantity" value={form.stock} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} className="border rounded px-3 py-2 sm:col-span-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="border rounded px-3 py-2 sm:col-span-2" rows={3} />

        <div className="sm:col-span-2 flex gap-3">
          <button className="bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border px-5 py-2 rounded hover:bg-slate-100">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">₹{p.price.toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => editProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
