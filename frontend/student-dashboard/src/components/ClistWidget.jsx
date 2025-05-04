import React, { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaRegCalendarAlt } from 'react-icons/fa';

const ClistWidget = ({ contests }) => {
  const [tag, setTag] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCalendar = async (contest) => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return alert("Login required");

    const user = JSON.parse(userRaw);
    if (!user?.email) return alert("Login required");

    try {
      await axios.post("http://localhost:5001/api/calendar/invite", {
        email: user.email,
        contest,
      });
      toast.success("Calendar invite sent!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invite 😓");
    }
  };

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

  const fetchProblemStats = async (contestId, index) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/visualization/stats?contestId=${contestId}&index=${index}`);
      
      if (!response.data.available) {
        setError(response.data.reason);
        setChartData(null);
      } else {
        setError(null);
        const timestamps = response.data.timestamps;
        setChartData({
          labels: timestamps.dates,
          counts: timestamps.counts,
        });
      }
    } catch (err) {
      console.error("Failed to fetch problem stats:", err);
      setError("Failed to fetch stats.");
      setChartData(null);
    }
  };

  return (
    <div className="bg-[#161B22] p-4 rounded-2xl shadow-lg text-white flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-[750px]">
      
      {/* Left: Contest List */}
      <div className="w-full md:w-1/2 flex flex-col">
      <div className="overflow-y-auto pr-2 flex-grow">
    <h2 className="text-xl font-semibold mb-4">Upcoming Contests</h2>
    <ul className="space-y-3">
      {contests.map((contest) => (
        <li key={contest.id} className="border-b border-gray-700 pb-2 relative">
          {/* Calendar Icon top-right */}
          <button
            onClick={() => handleAddToCalendar(contest)}
            className="absolute top-0 right-0 mt-1 mr-1 text-sm hover:text-green-400"
            title="Add to Calendar"
          >
            <FaRegCalendarAlt className="text-xl" />
          </button>

          <p className="text-lg font-medium">{contest.event}</p>
          <p className="text-sm text-gray-400">{contest.resource.name}</p>
          <p className="text-sm text-gray-400">Start: {new Date(contest.start).toLocaleString()}</p>
          <p className="text-sm text-gray-400">End: {new Date(contest.end).toLocaleString()}</p>
          <a
            href={contest.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm underline"
          >
            Go to Contest
          </a>
        </li>
      ))}
    </ul>
      </div>
    </div>

      {/* Right: Problem Search + Chart */}
      <div className="w-full md:w-1/2 h-full space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        <div className="h-[180vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        {/* Top Half: Problem Search */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Search CodeForces Problems</h2>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Enter problem tag (e.g., dp, graph)"
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
                  onClick={() => {
                    setSelectedProblem(problem);
                    fetchProblemStats(problem.contestId, problem.index);
                  }}
                  className="ml-2 mt-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-xs rounded"
                >
                  Show Stats
                </button>
                {error && selectedProblem?.id === problem.id && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Half: Chart Visualization */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-inner">
          {selectedProblem && chartData ? (
            <>
              <h3 className="text-md font-bold mb-3 text-center">
                Submissions for {selectedProblem.title}
              </h3>
              <div className="w-full h-[300px]">
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Accepted Submissions",
                        data: chartData.counts,
                        borderColor: "#3b82f6",
                        backgroundColor: "rgba(59, 130, 246, 0.3)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                />
              </div>
            </>
          ) : selectedProblem && (
            <p className="text-yellow-500 text-center">No chart data available yet.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClistWidget;
