import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import UpcomingContests from "./UpcomingContests";
import JobWidget from "./JobWidget";
import ProblemSearch from "./ProblemSearch";
import ProblemStats from "./ProblemStats";

const Dashboard = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [contests,setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/clist/contests");
        setContests(response.data);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen dark: bg-[#161B22] text-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Top Left: Upcoming Contests */}
        <div className="h-full">
          <UpcomingContests contests={contests} />
        </div>

        {/* Top Right: Problem Search */}
        <div className="bg-[#161B22] p-4 rounded-xl lg h-full overflow-hidden">
          <ProblemSearch onProblemSelect={setSelectedProblem} />
        </div>

        {/* Bottom Left: Job Listings */}
        <div className="h-full">
          <JobWidget />
        </div>

        {/* Bottom Right: Problem Stats */}
        <div className="bg-[#161B22] p-4 rounded-xl inner h-full overflow-hidden flex items-center justify-center">
          {selectedProblem ? (
            <ProblemStats selectedProblem={selectedProblem} />
          ) : (
            <p className="text-gray-400 text-center">Select a problem to view stats.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
