import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Correct import for the spinner icon

const JobWidget = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const location = "India"; // This can be dynamic later
        const response = await axios.post(
          "http://localhost:5001/api/personalized-jobs",
          { location },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(response.data.jobs || []);
      } catch (err) {
        console.error("Error fetching personalized jobs:", err.message);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#161B22] text-white p-4 rounded-xl h-full flex flex-col">
  <h2 className="text-xl font-bold mb-4 text-[#58A6FF]">
    Personalized Jobs for You
  </h2>

  {loading ? (
    <div className="flex items-center justify-center flex-grow">
      <FaSpinner className="animate-spin text-[#58A6FF] h-8 w-8" />
    </div>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : jobs.length === 0 ? (
    <p className="text-gray-400">No personalized jobs found.</p>
  ) : (
    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id || job.title} className="border-b border-gray-600 pb-2">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-400">
              {job.company} — {job.location}
            </p>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58A6FF] text-sm mt-2 block"
            >
              View Job
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default JobWidget;
