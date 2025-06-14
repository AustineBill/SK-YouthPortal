const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const EventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Asset/Events"); // Store in the desired folder
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "_"); // Optionally replace spaces with underscores
    cb(null, fileName); // Save the file with its original name
  },
});
const Eventupload = multer({ storage: EventStorage });

router.get("/events", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM home ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting events:", err);
    res.status(500).send("Internal Server Error");
  }
});

// API Endpoint to get a single event by ID
router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM home WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }
    res.json(result.rows[0]); // Send the event details as JSON
  } catch (err) {
    console.error("Error getting event:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/events", Eventupload.single("event_image"), async (req, res) => {
  const { event_name, event_description } = req.body;

  try {
    const event_image = await uploadImage(req.file.path);
    const result = await pool.query(
      "INSERT INTO home (event_name, event_description, event_image) VALUES ($1, $2, $3) RETURNING *",
      [event_name, event_description, event_image]
    );
    res.status(201).json(result.rows[0]); // Return the newly created event
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update an existing event
router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { event_name, event_description, event_image } = req.body;

  try {
    const result = await pool.query(
      "UPDATE home SET event_name = $1, event_description = $2, event_image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [event_name, event_description, event_image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    res.json(result.rows[0]); // Return the updated event details
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete an event
router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM home WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    res.json(result.rows[0]); // Return the deleted event details
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
