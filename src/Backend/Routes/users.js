const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

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

router.get("/Profile/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const query = `
        SELECT id, username, firstname, lastname, street, province, city, barangay, zone,
               sex, birthdate, birthday, email_address, contact_number, civil_status,
               youth_age_group, work_status, educational_background, 
               registered_sk_voter, registered_national_voter
        FROM Users
        WHERE username = $1
      `;
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err); // Log full error
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.post("/change-password-only", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  try {
    // Fetch the current user's password hash from the database
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentPasswordHash = user.rows[0].password;

    // Compare the old password with the stored hash
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      currentPasswordHash
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password before saving it
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password in the database with the hashed new password
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      newPasswordHash,
      id,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
