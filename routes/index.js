const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "success", message: "DevWithSunil API is running" });
});

router.get("/health", async (req, res) => {
  try {
    // Check database connection
    await pool.query("SELECT 1");

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "up",
        database: "up",
      },
    });
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "up",
        database: "down",
      },
      error: "Database connection failed",
    });
  }
});

module.exports = router;
