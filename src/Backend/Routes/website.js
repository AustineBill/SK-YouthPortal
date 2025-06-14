const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const uploadImage = require("../utils/upload"); // Assuming you have a utility function to handle image uploads

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const skOfficialsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Asset/SK_Officials"); // Store in the desired folder
  },
  filename: (req, file, cb) => {
    // Retain the original filename and just add a suffix to ensure uniqueness
    const fileName = file.originalname.replace(/\s+/g, "_"); // Optionally replace spaces with underscores
    cb(null, fileName); // Save the file with its original name
  },
});

const skOfficialsupload = multer({ storage: skOfficialsStorage });

const webUpload = multer({ storage: skOfficialsStorage });

/********** Website  ******** */

router.post("/Website", async (req, res) => {
  const { description, objectives, mission, vision } = req.body;

  // Validate the input data
  if (!description || !objectives || !mission || !vision) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert a new entry into the Website table
    await pool.query(
      "INSERT INTO Website (description, objectives, mission, vision) VALUES ($1, $2, $3, $4)",
      [description, objectives, mission, vision]
    );
    res.status(201).json({ message: "Website details added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding website details" });
  }
});

router.get("/Website", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Website WHERE id = $1", [1]);
    res.json(result.rows[0]); // Send the website details
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching website details" });
  }
});

router.put("/Website", webUpload.single("image"), async (req, res) => {
  const { description, objectives, mission, vision } = req.body;

  // Only update the fields that are provided
  let updateFields = [];
  let values = [];

  if (description) {
    updateFields.push("description = $1");
    values.push(description);
  }

  if (objectives) {
    updateFields.push("objectives = $2");
    values.push(objectives);
  }

  if (mission) {
    updateFields.push("mission = $3");
    values.push(mission);
  }

  if (vision) {
    updateFields.push("vision = $4");
    values.push(vision);
  }

  // Handle image upload if provided
  let uploadedImageUrl = req.body.image_url || null; // Default to null if no image URL provided
  if (req.file) {
    uploadedImageUrl = await uploadImage(req.file.path); // Assume this uploads the file and returns the URL
    updateFields.push("image_url = $5");
    values.push(uploadedImageUrl);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    // Build the update query dynamically based on the fields
    const query = `UPDATE Website SET ${updateFields.join(", ")} WHERE id = 1`;

    // Execute the query with the dynamically created values
    await pool.query(query, values);
    res.json({ message: "Website details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating website details" });
  }
});

/********** Council  ******** */

router.get("/api/sk", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Website");

    const skcouncil = result.rows
      .map((item) => {
        // Split the image URLs stored as an array in the database
        const imageUrls = item.image_url.replace(/[{}"]/g, "").split(",");

        // Process each URL
        return imageUrls.map((url) => ({
          ...item,
          image_url: url.startsWith("http")
            ? url
            : `https://isked-backend-ssmj.onrender.com/${url.replace(
                "/Asset",
                "/public/Asset"
              )}`,
        }));
      })
      .flat(); // Flatten the array of image URLs into a single array

    res.status(200).json(skcouncil);
  } catch (error) {
    console.error("Error fetching SK Council data:", error);
    res.status(500).json({ error: "Failed to fetch SK Photos data" });
  }
});

router.get("/Skcouncil", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Skcouncil");

    const skcouncil = result.rows
      .map((item) => {
        // Ensure image_url exists and is not null/undefined before processing
        if (item.image_url) {
          const imageUrls = item.image_url.replace(/[{}"]/g, "").split(",");

          // Process each URL
          return imageUrls.map((url) => ({
            ...item,
            image_url: url.startsWith("http")
              ? url
              : `https://isked-backend-ssmj.onrender.com/${url.replace(
                  "/Asset",
                  "/public/Asset"
                )}`,
          }));
        } else {
          // If no image_url exists, return the item as is
          return item;
        }
      })
      .flat(); // Flatten the array of image URLs into a single array

    res.status(200).json(skcouncil);
  } catch (error) {
    console.error("Error fetching SK Council data:", error);
    res.status(500).json({ error: "Failed to fetch SK Photos data" });
  }
});

// Add new SkCouncil record
router.post(
  "/Skcouncil",
  skOfficialsupload.single("image"),
  async (req, res) => {
    // Ensure the file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = "/Asset/SK_Officials/" + req.file.filename; // Use the new unique filename path
    const uploadedImageUrl = await uploadImage(req.file.path); // Wait for the upload to finish

    try {
      // Check if the image already exists in the database
      const existingRecord = await pool.query(
        "SELECT * FROM SkCouncil WHERE image = $1",
        [uploadedImageUrl]
      );

      if (existingRecord.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Image with this filename already exists" });
      }

      // If no duplicate is found, insert the new record
      const result = await pool.query(
        "INSERT INTO SkCouncil (image) VALUES ($1) RETURNING *",
        [uploadedImageUrl]
      );

      res.status(201).json({
        message: "Record added successfully",
        data: result.rows[0], // Return the newly added record
      });
    } catch (error) {
      console.error("Error adding record:", error);
      res.status(500).json({ error: "Failed to add SkCouncil record" });
    }
  }
);

// Edit an existing SkCouncil record
router.put(
  "/Skcouncil/:id",
  skOfficialsupload.single("image"),
  async (req, res) => {
    const { id } = req.params; // Get the id of the record from the URL parameter
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imagePath = "/Asset/SK_Officials/" + req.file.filename; // Generate the image path
    const uploadedImageUrl = await uploadImage(req.file.path); // Wait for the upload to finish

    try {
      const result = await pool.query(
        "UPDATE SkCouncil SET image = $1 WHERE id = $2 RETURNING *",
        [uploadedImageUrl, id] // Update the image column with the new file path
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.status(200).json({
        message: "Record updated successfully",
        data: result.rows[0], // Return the updated record with the new image
      });
    } catch (error) {
      console.error("Error updating record:", error);
      res.status(500).json({ error: "Failed to update SkCouncil record" });
    }
  }
);

/********** Contact  ******** */
router.get("/contact", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT contact_number, location, gmail, facebook FROM public.contact WHERE id = $1",
      [1]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching contact details:", error);
    res.status(500).json({ error: "Error fetching contact details" });
  }
});

router.put("/contact", async (req, res) => {
  const { contact_number, location, gmail, facebook } = req.body;

  // Build the SET clause dynamically based on provided fields
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (contact_number !== undefined) {
    fields.push(`contact_number = $${paramIndex++}`);
    values.push(contact_number);
  }

  if (location !== undefined) {
    fields.push(`location = $${paramIndex++}`);
    values.push(location);
  }

  if (gmail !== undefined) {
    fields.push(`gmail = $${paramIndex++}`);
    values.push(gmail);
  }

  if (facebook !== undefined) {
    fields.push(`facebook = $${paramIndex++}`);
    values.push(facebook);
  }

  // Check if at least one field is provided
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  // Add ID to the end
  values.push(1); // hardcoded ID
  const query = `UPDATE public.contact SET ${fields.join(
    ", "
  )} WHERE id = $${paramIndex}`;

  try {
    await pool.query(query, values);
    res.json({ message: "Contact details updated successfully" });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({ error: "Error updating contact details" });
  }
});

module.exports = router;
