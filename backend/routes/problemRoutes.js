//routes/problemRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { tag } = req.query;
  if (!tag) {
    return res.status(400).json({ error: "Tag query param is required" });
  }

  try {
    const results = [];

    // Fetch problems from Codeforces
    try {
      const cfRes = await axios.get(`https://codeforces.com/api/problemset.problems`);
      const problems = cfRes.data.result.problems;
      const filtered = problems.filter((p) => p.tags.includes(tag.toLowerCase()));

      // Only add relevant problem data
      filtered.forEach((p) => {
        results.push({
          id: `CF-${p.contestId}${p.index}`,
          title: `${p.name} [${p.contestId}${p.index}]`,
          platform: "Codeforces",
          url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          contestId: p.contestId,
          index: p.index,
          isGymProblem: p.contestId === 0, // Gym problems have contestId 0
        });
      });
    } catch (err) {
      console.warn("Codeforces fetch failed:", err.message);
    }

    res.json(results);
  } catch (err) {
    console.error("Problem fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

module.exports = router;
