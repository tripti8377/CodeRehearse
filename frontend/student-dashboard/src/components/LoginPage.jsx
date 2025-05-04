// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email: formData.email }));
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            Login
          </button>
        </form>
  </div>
  );
};

export default LoginPage;
