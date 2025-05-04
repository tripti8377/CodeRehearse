// src/components/AuthPage.jsx
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xl">
        <div className="flex justify-center ">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 mr-2 rounded ${
              isLogin ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded ${
              !isLogin ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? <LoginPage /> : <RegisterPage />}
      </div>
    </div>
  );
};

export default AuthPage;
