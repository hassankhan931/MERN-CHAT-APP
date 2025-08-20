import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.jsx"; // ✅ correct for default export
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 mb-4 border rounded"/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 mb-4 border rounded"/>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
    </form>
  );
};

export default LoginForm;
