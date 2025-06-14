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

router.post("/mark/:status", async (req, res) => {
  const { ids } = req.body;
  const { status } = req.params;
  const validStatuses = ["Returned", "Not Returned", "Received"];

  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    await pool.query(
      "UPDATE Equipment SET status = $1 WHERE id = ANY($2::int[])",
      [status, ids] // No need for `replace` anymore
    );
    res.status(200).send(`Equipment reservations marked as ${status}`);
  } catch (error) {
    console.error(`Error marking equipment reservations as ${status}:`, error);
    res.status(500).send("Server error");
  }
});

router.post("/update/status", async (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || !status) {
    return res.status(400).send("Missing or invalid 'ids' or 'status'");
  }

  try {
    await pool.query(
      "UPDATE Schedules SET status = $1 WHERE id = ANY($2::int[])",
      [status, ids]
    );
    res.status(200).send(`Reservations updated to ${status}`);
  } catch (error) {
    console.error(`Error updating reservations to ${status}:`, error);
    res.status(500).send("Server error");
  }
});
module.exports = router;
