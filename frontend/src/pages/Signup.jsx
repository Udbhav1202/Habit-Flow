import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Accept setUser as a prop
const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = "/api/users/register";
      const response = await axios.post(API_URL, formData);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // 2. Update the state in App.jsx
        setUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error.response.data.message);
      alert(`Signup failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
