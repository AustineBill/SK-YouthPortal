const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for Admin credentials in the Admins table
    const adminResult = await pool.query(
      "SELECT * FROM Admins WHERE username = $1",
      [username]
    );

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];

      // Compare password for admin login
      if (admin.password === password) {
        return res.status(200).json({
          message: "Admin login successful",
          user: { id: admin.id, username: admin.username, role: "admin" },
        });
      } else {
        return res.status(400).json({ message: "Invalid admin password" });
      }
    }

    // If not admin, check for regular user credentials in Users table
    const userResult = await pool.query(
      "SELECT * FROM Users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      // Validate password for user login (bcrypt used for users)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      // Return user details including ID
      return res.status(200).json({
        message: "User login successful",
        user: {
          id: user.id,
          username: user.username,
          address: user.address,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: "user", // Adding role for user
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
