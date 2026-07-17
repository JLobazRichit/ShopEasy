import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-8 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-6 text-center">Create Account</h1>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border rounded px-3 py-2"
        />

        {/* For learning/testing only — lets you create an admin account easily.
            Remove this dropdown in a real production app. */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="customer">Register as Customer</option>
          <option value="admin">Register as Admin (testing only)</option>
        </select>

        <button
          disabled={loading}
          className="bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-emerald-600 font-medium">Login</Link>
      </p>
    </div>
  );
}
