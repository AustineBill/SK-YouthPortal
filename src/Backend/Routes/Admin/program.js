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

const ProgramStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Asset/Programs"); // Store in the desired folder
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, fileName); // Save the file with its original name
  },
});
const Programupload = multer({ storage: ProgramStorage });

router.get("/api/programs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Programs");
    const programs = result.rows.map((program) => {
      // Check if image_url is null or undefined before attempting to use startsWith
      const imageUrl = program.image_url
        ? program.image_url.startsWith("http")
          ? program.image_url
          : `https://isked-backend-ssmj.onrender.com/${program.image_url.replace(
              "/Asset",
              "/public/Asset"
            )}`
        : null; // Return null if image_url is not available

      return {
        ...program,
        image_url: imageUrl,
      };
    });
    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

router.get("/api/programs/:programType", async (req, res) => {
  const { programType } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Programs WHERE program_type = $1",
      [programType]
    );
    const program = result.rows[0];
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }
    // Process the image URL as needed
    res.status(200).json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    res.status(500).json({ error: "Failed to fetch program" });
  }
});

router.get("/programs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM programs WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Program not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error getting program:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/programs", Programupload.single("image"), async (req, res) => {
  const { program_name, description, heading, program_type } = req.body;

  const image_url = req.file ? await uploadImage(req.file.path) : null;

  try {
    // Insert the new program into the database
    const query = `
      INSERT INTO Programs (program_name, description, heading, program_type, image_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [
      program_name,
      description,
      heading,
      program_type,
      image_url,
    ];
    const result = await pool.query(query, values);
    const newProgram = result.rows[0];
    res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error inserting program:", error);
    res.status(500).json({ error: "Failed to create program" });
  }
});

// Update a program by ID
router.put("/programs/:id", Programupload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { program_name, description, heading, program_type } = req.body;

  if (!program_name || !description || !heading || !program_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let image_url = null;

  if (req.file) {
    // Use the new uploaded image if provided
    image_url = await uploadImage(req.file.path); //`/Asset/Programs/${req.file.filename}`;
  } else {
    // Retain the existing image URL if no new file is uploaded
    const existingProgram = await pool.query(
      "SELECT image_url FROM programs WHERE id = $1",
      [id]
    );
    if (existingProgram.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    image_url = existingProgram.rows[0].image_url;
  }

  try {
    const result = await pool.query(
      `UPDATE programs 
       SET program_name = $1, description = $2, heading = $3, program_type = $4, image_url = $5
       WHERE id = $6 RETURNING *`,
      [program_name, description, heading, program_type, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating program:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/programs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM programs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Program not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting program:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
