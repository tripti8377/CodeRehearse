const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/stats", async (req, res) => {
  const { contestId, index } = req.query;

  if (!contestId || !index) {
    return res.status(400).json({ error: "contestId and index are required" });
  }

  if (contestId === "0") {
    return res.status(400).json({
      available: false,
      reason: "Gym problems do not have submission data available.",
    });
  }

  try {
    let from = 1;
    const countPerPage = 500;
    const maxAccepted = 100;
    let collected = [];

    while (collected.length < maxAccepted) {
      const response = await axios.get(
        `https://codeforces.com/api/contest.status?contestId=${contestId}&from=${from}&count=${countPerPage}`
      );
      const submissions = response.data.result;

      if (submissions.length === 0) break;

      const filtered = submissions.filter(
        (sub) =>
          sub.verdict === "OK" &&
          sub.problem &&
          sub.problem.contestId === parseInt(contestId) &&
          sub.problem.index === index
      );

      collected = collected.concat(filtered);

      if (submissions.length < countPerPage) break;

      from += countPerPage;
    }

    // Trim to exactly 500 if overfetched
    collected = collected.slice(0, maxAccepted);

    if (collected.length === 0) {
      return res.json({
        available: false,
        reason: "No accepted submissions found for this problem.",
      });
    }

    const dateCounts = {};
    collected.forEach((sub) => {
      const date = new Date(sub.creationTimeSeconds * 1000)
        .toISOString()
        .split("T")[0];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map((date) => dateCounts[date]);

    res.json({
      available: true,
      timestamps: {
        dates,
        counts,
      },
    });
  } catch (err) {
    console.error("Error fetching submission data:", err.message);
    res.status(500).json({
      available: false,
      reason: "Failed to fetch submission data.",
    });
  }
});

module.exports = router;
