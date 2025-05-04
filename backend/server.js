//backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const joobleRoutes = require("./routes/jooble");
require("./cronJobs/newsletterJob");
const calendarRoutes = require('./routes/calendar');

const app = express();
const PORT = process.env.PORT || 5001;
const subscribeRoute = require('./routes/subscribe');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clist", require("./routes/clistRoutes"));
app.use("/api", joobleRoutes);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/calendar', calendarRoutes);
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/visualization", require("./routes/visualization"));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
