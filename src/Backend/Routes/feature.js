const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

router.post("/Feedback", async (req, res) => {
  const { user_id, rating, comment } = req.body;
  if (!user_id || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await pool.query(
      "INSERT INTO feedback (user_id, rating, comment) VALUES ($1, $2, $3)",
      [user_id, rating, comment]
    );

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "An error occurred while saving feedback." });
  }
});

module.exports = router;
