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

router.get("/date-settings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM date_settings ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get the single time setting (only one row exists)
router.get("/time-settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_settings LIMIT 1");
    res.json(result.rows[0] || {}); // Return empty object if no data exists
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const timeGapResult = await pool.query(`
        SELECT time_gap FROM settings 
        WHERE time_gap IS NOT NULL 
        ORDER BY created_at DESC 
        LIMIT 1
      `);

    const timeGap =
      timeGapResult.rows.length > 0 ? timeGapResult.rows[0].time_gap : 1;

    // Get blocked dates
    const blockedDatesResult = await pool.query(`
        SELECT start_date, end_date FROM settings 
        WHERE start_date IS NOT NULL
      `);

    res.json({
      blocked_dates: blockedDatesResult.rows,
      time_gap: timeGap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/settings/time-gap", async (req, res) => {
  try {
    const { time_gap } = req.body;

    if (!time_gap || isNaN(time_gap)) {
      return res.status(400).json({ error: "Invalid time gap value!" });
    }

    // Check if time_settings already has a row
    const checkExisting = await pool.query(
      "SELECT * FROM time_settings LIMIT 1"
    );

    if (checkExisting.rowCount === 0) {
      // Insert if no row exists
      await pool.query(
        "INSERT INTO time_settings (id, time_gap) VALUES (TRUE, $1)",
        [time_gap]
      );
    } else {
      // Update if a row exists
      await pool.query(
        "UPDATE time_settings SET time_gap = $1, created_at = NOW()",
        [time_gap]
      );
    }

    res.json({ message: "Time gap updated successfully!" });
  } catch (err) {
    console.error("Error updating time gap:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Insert blocked date range
router.post("/settings/block-dates", async (req, res) => {
  const { start_date, end_date } = req.body;

  if (!start_date) {
    return res.status(400).json({ error: "Start date is required" });
  }

  try {
    await pool.query(
      "INSERT INTO date_settings (start_date, end_date) VALUES ($1, $2);",
      [start_date, end_date || null]
    );
    res.json({ message: "Blocked date range added successfully" });
  } catch (error) {
    console.error("Error inserting blocked dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/settings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM settings WHERE id = $1", [id]);
    res.send("Block date removed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
