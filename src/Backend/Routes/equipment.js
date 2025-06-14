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

router.get("/ViewEquipment", async (req, res) => {
  try {
    // Query to fetch equipment details, using JSON functions to extract data
    const result = await pool.query(`
        SELECT 
            e.start_date, 
            u.username, 
            jsonb_array_elements(e.reserved_equipment) AS equipment
        FROM Equipment e
        JOIN Users u ON e.user_id = u.id
        WHERE e.start_date >= CURRENT_DATE
          AND (e.is_archived IS NULL OR e.is_archived = FALSE OR e.is_archived != 't') -- Exclude archived records
        ORDER BY e.start_date ASC
      `);

    // Map the result to extract equipment name and quantity
    const formattedResult = result.rows.map((row) => ({
      start_date: row.start_date,
      username: row.username,
      equipment_name: row.equipment.name,
      quantity: row.equipment.quantity,
    }));

    res.json(formattedResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
