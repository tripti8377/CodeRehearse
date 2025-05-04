import React, { useEffect, useState } from "react";
import ThemeToggle from "./themeToggle";
import { FaUser, FaSignOutAlt, FaBell, FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const Header = () => {
  const [username, setUsername] = useState("Student");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || "Student");

        const base64Payload = token.split('.')[1];
        const decodedPayload = atob(base64Payload);
        const payload = JSON.parse(decodedPayload);
        setEmail(payload.email);

        axios
          .post('http://localhost:5001/api/subscribe/status', { email: payload.email })
          .then((res) => {
            setSubscribed(res.data.isSubscribed);
          })
          .catch((err) => {
            console.error("Status check error:", err.response?.data?.message || err.message);
          });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleToggleSubscribe = async () => {
    if (!email) {
      alert("No email found. Please log in.");
      return;
    }

    const token = localStorage.getItem("token");
    const route = subscribed
      ? 'http://localhost:5001/api/subscribe/unsubscribe'
      : 'http://localhost:5001/api/subscribe';

    try {
      const res = await axios.post(
        route,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success || res.data.message) {
        setSubscribed(!subscribed);
        alert(subscribed ? "Unsubscribed successfully!" : "Subscribed successfully!");
      }
    } catch (err) {
      console.error("Subscription toggle error:", err.response?.data?.message || err.message);
      alert("Action failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  
  return (
    <header className="sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between bg-[#1A1A22] lg px-6 py-4 gap-4">
      {/* Left: Logo */}
      <h1 className="text-3xl font-bold text-[#58A6FF]">CodeRehearse</h1>

      {/* Center: Welcome */}
      <div className="text-3xl font-bold text-[#C9D1D9]">Welcome, {username}!</div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        <FaUser size={24} className="text-[#58A6FF]" />

        {/* Bell Icon for Subscribe Toggle */}
        <FaBell
          size={24}
          onClick={handleToggleSubscribe}
          className={`cursor-pointer transition ${
            subscribed ? "text-blue-500 hover:text-blue-600" : "text-gray-400 hover:text-gray-300"
          }`}
          title={subscribed ? "Unsubscribe the tech news updates" : "Want tech news updates on email?"}
        />
        {/* Theme Toggle Button */}
{/* <button
  onClick={() => setDarkMode(!darkMode)}
  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
  className="text-yellow-400 hover:text-yellow-300 transition"
>
  {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
</button> */}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
        >
          <FaSignOutAlt className="text-white text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;
