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

const MilestoneStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Asset/Milestone"); // Store in the desired folder
  },
  filename: (req, file, cb) => {
    // Retain the original filename and just add a suffix to ensure uniqueness
    const fileName = file.originalname.replace(/\s+/g, "_"); // Optionally replace spaces with underscores
    cb(null, fileName); // Save the file with its original name
  },
});

const Milestonesupload = multer({ storage: MilestoneStorage });

router.get("/spotlight", async (req, res) => {
  try {
    // Fetching data from the 'Spotlight' table
    const result = await pool.query("SELECT * FROM Spotlight");

    // Map through the rows and process image URLs
    const spot = result.rows
      .map((item) => {
        // Check if 'images' exists and is not empty
        if (!item.images) {
          return null; // Skip this item if no images exist
        }

        // Split the 'images' column value into individual image paths
        const imageUrls = item.images.split(",").map((url) => url.trim()); // Trim any extra spaces from URLs

        // Map the frontimage and the individual images
        return {
          ...item,
          frontImage: item.frontimage
            ? `https://isked-backend-ssmj.onrender.com/${item.frontimage.replace(
                "/Asset",
                "/public/Asset"
              )}`
            : null,
          images: imageUrls.map((url) =>
            url.startsWith("http")
              ? url
              : `https://isked-backend-ssmj.onrender.com/${url.replace(
                  "/Asset",
                  "/public/Asset"
                )}`
          ),
        };
      })
      .filter(Boolean); // Remove null entries (where images were missing)

    // Return the processed spotlight data as JSON
    res.status(200).json(spot);
  } catch (error) {
    console.error("Error fetching spotlight data:", error);
    res.status(500).json({ error: "Failed to fetch spotlight data" });
  }
});

router.post(
  "/spotlight",
  Milestonesupload.array("additionalImages", 10), // Handle only additional images
  async (req, res) => {
    try {
      // Process additional images
      const additionalImages = req.files
        ? await Promise.all(
            req.files.map(async (file) => await uploadImage(file.path))
          )
        : [];

      if (additionalImages.length === 0) {
        return res
          .status(400)
          .json({ error: "No additional images provided." });
      }

      // Insert milestone data into the database
      const result = await pool.query(
        "INSERT INTO Spotlight (images) VALUES ($1) RETURNING *",
        [additionalImages.join(",")]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error adding milestone:", error);
      res.status(500).json({ error: "Failed to add milestone" });
    }
  }
);

router.delete("/spotlight/:id", async (req, res) => {
  const spotlightId = req.params.id;

  try {
    // Delete the spotlight image from the database based on the ID
    const result = await pool.query(
      "DELETE FROM spotlight WHERE id = $1 RETURNING *",
      [spotlightId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Spotlight not found" });
    }

    // Respond with a success message
    res.json({
      message: "Spotlight removed successfully",
      spotlightId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error deleting spotlight:", error);
    res.status(500).json({ message: "Failed to delete spotlight" });
  }
});

module.exports = router;
