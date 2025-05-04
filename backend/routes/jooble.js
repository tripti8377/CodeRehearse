//backend/routes/jooble.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

router.post("/personalized-jobs", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Assuming your middleware adds req.user
    if (!user || !user.interests || user.interests.length === 0) {
      return res.status(400).json({ message: "No interests found for user" });
    }

    const keywords = user.interests.join(", ");
    const location = req.body.location || "India";

    const payload = {
      keywords,
      location,
      radius: "100",
      page: "1",
      companysearch: "false",
      ResultOnPage: "5",
    };

    const response = await axios.post(
      `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Jooble API error:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});


module.exports = router;
