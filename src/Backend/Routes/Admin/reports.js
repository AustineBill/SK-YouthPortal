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

router.get("/user-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user data");
  }
});

// Route for fetching equipment reservations
router.get("/equipment-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching equipment data");
  }
});

// Route for fetching gym reservations (schedules)
router.get("/schedule-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schedules");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching schedules data");
  }
});

module.exports = router;
