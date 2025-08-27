import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Accept setUser as a prop
const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = "/api/users/login";
      const response = await axios.post(API_URL, formData);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // 2. Update the state in App.jsx
        setUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      alert(`Login failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
