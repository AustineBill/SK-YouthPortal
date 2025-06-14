const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// Multer storage config
const Inventorystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public", "Equipment");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: Inventorystorage });

// POST /inventory
router.post("/inventory", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const { name, quantity, specification } = req.body;
    const imageUrl = "/Equipment/" + req.file.filename;
    const status = quantity >= 1 ? "Available" : "Out of Stock";

    const query =
      "INSERT INTO inventory (name, quantity, specification, status, image) VALUES ($1, $2, $3, $4, $5)";
    const values = [name, quantity, specification, status, imageUrl];

    await pool.query(query, values);
    res.status(201).send("Item added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET /inventory
router.get("/inventory", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT /inventory/:id
router.put("/inventory/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, specification, status } = req.body;

    let query =
      "UPDATE inventory SET name = $1, quantity = $2, specification = $3, status = $4";
    const values = [name, quantity, specification, status];

    if (req.file) {
      const imageUrl = "/Equipment/" + req.file.filename;
      query += ", image = $5 WHERE id = $6";
      values.push(imageUrl, id);
    } else {
      query += " WHERE id = $5";
      values.push(id);
    }

    await pool.query(query, values);
    res.status(200).send("Item updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE /inventory/:id
router.delete("/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT image FROM inventory WHERE id = $1",
      [id]
    );

    if (result.rows.length > 0) {
      const imagePath = path.join(__dirname, "public", result.rows[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
    res.status(200).send("Item deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
