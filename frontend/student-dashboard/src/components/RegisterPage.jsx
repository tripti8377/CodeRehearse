import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Role categories
const categorizedRoles = {
  "Web Development": [
    "Frontend Developer",
    "JavaScript Developer",
    "React/Vue/Angular Developer",
    "UI Developer",
    "Web Designer",
    "Backend Developer",
    "Node.js Developer",
    "API Developer",
    "Database Developer",
    "Full-Stack Web Developer",
    "MEAN/MERN Stack Developer",
    "WordPress Developer",
    "Web Security Engineer",
    "SEO Developer"
  ],
  "Machine Learning / Data Science": [
    "Machine Learning Engineer",
    "Deep Learning Engineer",
    "NLP Engineer",
    "AI Engineer",
    "Data Scientist",
    "Data Analyst",
    "MLOps Engineer",
    "Reinforcement Learning Engineer",
    "AI Ethics Researcher"
  ],
  "Software Engineering/Others": [
    "Software Engineer",
    "Systems Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Mobile Developer",
    "Flutter Developer",
    "Game Developer",
    "Blockchain Developer",
    "AR/VR Developer"
  ]
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    interests: []
  });
  const [error, setError] = useState("");
  const [openCategories, setOpenCategories] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleInterest = (role) => {
    setFormData((prev) => {
      const isSelected = prev.interests.includes(role);
      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((r) => r !== role)
          : [...prev.interests, role],
      };
    });
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className=" bg-gray-900 text-white">
  <div className="bg-gray-800 p-10 w-full max-w-xl h-[75vh] rounded-lg shadow-md flex flex-col">
    <h2 className="text-xl font-bold text-center mb-4">Register</h2>
    {error && <p className="text-red-500 text-center mb-2">{error}</p>}

    {/* Scrollable top section */}
    <form
      onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-700"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-700"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-700"
        required
      />

      <label className="block font-semibold">Select Your Interests:</label>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {Object.entries(categorizedRoles).map(([category, roles]) => (
          <div key={category} className="border border-gray-700 rounded p-2">
            <button
              type="button"
              className="w-full text-left font-semibold mb-2"
              onClick={() => toggleCategory(category)}
            >
              {openCategories[category] ? "▼" : "►"} {category}
            </button>
            {openCategories[category] && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleInterest(role)}
                    className={`p-2 rounded text-sm ${
                      formData.interests.includes(role)
                        ? "bg-blue-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </form>

    {/* Fixed bottom section */}
    <div className="mt-4">
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
      >
        Register
      </button>
      <p className="text-center mt-3 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  </div>
</div>
  );
};

export default RegisterPage;
