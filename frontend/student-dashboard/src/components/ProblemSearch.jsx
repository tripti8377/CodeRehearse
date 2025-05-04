import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProblemSearch = ({ onProblemSelect }) => {
  const [tag, setTag] = useState("");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProblems = async () => {
    if (!tag) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/problems?tag=${tag}`);
      setProblems(response.data);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      toast.error("Could not fetch problems 😓");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl text-[#58A6FF] font-semibold mb-3">Search CodeForces Problems</h2>
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Enter problem tag (e.g., dp, graphs)"
          className="p-2 rounded bg-gray-800 text-white w-full"
        />
        <button
          onClick={fetchProblems}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="max-h-[200px] overflow-y-auto border border-gray-700 rounded p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {problems.map((problem) => (
          <div key={problem.id} className="p-2 border-b border-gray-700">
            <p className="text-sm font-medium">{problem.title}</p>
            <p className="text-xs text-gray-400">{problem.platform}</p>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs underline"
            >
              Solve Problem
            </a>
            <button
              onClick={() => onProblemSelect(problem)}
              className="ml-2 mt-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-xs rounded"
            >
              Show Stats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSearch;
