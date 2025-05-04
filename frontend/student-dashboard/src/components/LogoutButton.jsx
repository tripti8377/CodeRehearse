import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import logout icon

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition-all duration-300"
    >
      <FiLogOut /> {/* Logout icon */}
      Logout
    </button>
  );
};

export default LogoutButton;
