// src/App.jsx
import React from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home"; // or { Header, Dashboard } if you prefer
import "./index.css";

function App() {
  return (
    <Router className="dark: bg-gray-900">
      {/* Place Toaster here, outside <Routes> */}
      <Toaster position="centre" reverseOrder={false} />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}


export default App;
