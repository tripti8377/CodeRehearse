import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const ProblemStats = ({ selectedProblem }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!selectedProblem) return;

    const fetchProblemStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/visualization/stats?contestId=${selectedProblem.contestId}&index=${selectedProblem.index}`
        );

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

    fetchProblemStats();
  }, [selectedProblem]);

  // Cleanup previous chart instance on component re-render or unmount
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="bg-gray-900 p-4 rounded-xl inner">
      {selectedProblem && chartData ? (
        <>
          <h3 className="text-md font-bold mb-3 text-center">
            Submissions for {selectedProblem.title}
          </h3>
          <div className="w-full h-[200px]">
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
              // Store the chart instance when it renders
              ref={(chart) => {
                if (chart) {
                  chartInstanceRef.current = chart.chartInstance;
                }
              }}
            />
          </div>
        </>
      ) : selectedProblem ? (
        <p className="text-yellow-500 text-center">
          {error || "No chart data available yet."}
        </p>
      ) : (
        <p className="text-gray-400 text-center">Select a problem to view stats.</p>
      )}
    </div>
  );
};

export default ProblemStats;