import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The API endpoint on your Node.js server
      const API_URL = "/api/users/register";

      // Send a POST request to the backend
      const response = await axios.post(API_URL, formData);

      // If the request is successful (status 201)
      if (response.data) {
        // Store user info and token in local storage
        localStorage.setItem("user", JSON.stringify(response.data));
        
        // Redirect to the dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle errors (e.g., user already exists)
      console.error("Signup failed:", error.response.data.message);
      alert(`Signup failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg"
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
