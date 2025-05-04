// backend/routes/clistRoutes.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.get("/contests", async (req, res) => {
  try {
    const response = await axios.get("https://clist.by/api/v4/contest/", {
      headers: {
        Authorization: `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}`,
      },
      params: {
        start__gt: new Date().toISOString(),
        order_by: "start",
        limit: 5,
      },
    });

    const contests = response.data.objects.map(contest => ({
      event: contest.event,
      start: contest.start,
      end: contest.end,
      href: contest.href,
      resource: { name: contest.resource.name },
    }));

    res.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});

module.exports = router;
