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

/********* Feedback  *********/
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

/********* Auto Fill Details  *********/
router.get("/Details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT username, birthdate, email_address AS email FROM Users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/***** Check Reservatoion *******/
router.post("/ValidateReservation", async (req, res) => {
  const { user_id, start_date, end_date } = req.body;

  try {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Query to check for overlroutering reservations only for this user
    const overlapQuery = `
      SELECT * FROM Schedules 
      WHERE user_id = $1
      AND (is_archived IS NULL OR is_archived = FALSE) -- Exclude archived reservations
      AND (
        (start_date <= $2 AND end_date >= $2) OR -- Overlap with new start date
        (start_date <= $3 AND end_date >= $3) OR -- Overlap with new end date
        (start_date >= $2 AND end_date <= $3)    -- Fully contained within new range
      )
    `;
    const overlapValues = [user_id, startDate, endDate];
    const overlapResult = await pool.query(overlapQuery, overlapValues);

    // If any rows are returned, there is an overlap
    if (overlapResult.rowCount > 0) {
      return res.json({
        success: false,
        message: "You already have a reservation overlroutering these dates.",
      });
    }

    // If no overlaps, allow the reservation
    return res.json({ success: true, message: "Reservation allowed." });
  } catch (error) {
    console.error("Error validating reservation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
