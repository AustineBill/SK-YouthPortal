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

router.post("/reservations", async (req, res) => {
  const {
    user_id,
    reservation_id,
    reservation_type,
    start_date,
    end_date,
    status,
    time_slot,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Schedules (user_id, reservation_id, reservation_type, start_date, end_date, status, time_slot)
           VALUES ($1, $2, $3, $4, $5, $6 , $7) RETURNING *`,
      [
        user_id,
        reservation_id,
        reservation_type,
        start_date,
        end_date,
        status,
        time_slot,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).send("Server error");
  }
});

router.get("/reservations", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    const result = await pool.query(
      `SELECT id, reservation_id, reservation_type AS program, start_date AS date, end_date, status, time_slot 
           FROM Schedules 
           WHERE user_id = $1 AND is_archived = false
           ORDER BY start_date ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Server error");
  }
});

router.get("/ViewSched", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            s.start_date, 
            s.end_date, 
            s.time_slot, 
            u.username, 
            s.reservation_type -- Include reservation_type in the response
        FROM Schedules s
        JOIN Users u ON s.user_id = u.id
        WHERE s.start_date >= CURRENT_DATE::date
          AND (s.is_archived IS NULL OR s.is_archived = FALSE OR s.is_archived != 't') -- Exclude archived records
        ORDER BY s.start_date ASC
      `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No schedules found" });
    }

    res.json(result.rows); // Send the result as a JSON response
  } catch (err) {
    console.error("Error during query execution:", err);
    res.status(500).json({ error: err.message }); // Send error message if there's an issue
  }
});

module.exports = router;
