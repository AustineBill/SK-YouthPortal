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

// Fetch all users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// Insert into the database with random ID generation
router.post("/users", async (req, res) => {
  const {
    username,
    password,
    firstname,
    lastname,
    street,
    province,
    city,
    barangay,
    zone,
    sex,
    birthdate,
    birthday,
    email_address,
    contact_number,
    civil_status,
    youth_age_group,
    work_status,
    educational_background,
    registered_sk_voter,
    registered_national_voter,
  } = req.body;

  const userId = generateRandomId();

  try {
    const checkDuplicateQuery = `
      SELECT * FROM Users 
      WHERE email_address = $1 OR (firstname = $2 AND lastname = $3)
    `;
    const checkResult = await pool.query(checkDuplicateQuery, [
      email_address,
      firstname,
      lastname,
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "Duplicate user data found." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with a default "inactive" status
    const result = await pool.query(
      `INSERT INTO Users (
        id, username, password, firstname, lastname, street, province, city, barangay, zone, sex, birthdate, 
        birthday, email_address, contact_number, civil_status, youth_age_group, work_status, 
        educational_background, registered_sk_voter, registered_national_voter, status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 'inactive')
      RETURNING *`,
      [
        userId,
        username,
        hashedPassword,
        firstname,
        lastname,
        street,
        province,
        city,
        barangay,
        zone,
        sex,
        birthdate,
        birthday,
        email_address,
        contact_number,
        civil_status,
        youth_age_group,
        work_status,
        educational_background,
        registered_sk_voter,
        registered_national_voter,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Server error");
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    firstname,
    lastname,
    street,
    province,
    city,
    barangay,
    zone,
    sex,
    birthdate,
    birthday,
    email_address,
    contact_number,
    civil_status,
    youth_age_group,
    work_status,
    educational_background,
    registered_sk_voter,
    registered_national_voter,
  } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const query = `
      UPDATE users SET
        username = $1, 
        ${password ? "password = $2," : ""}
        firstname = $3, lastname = $4, street = $5, province = $6, 
        city = $7, barangay = $8, zone = $9, sex = $10, birthdate = $11, 
        birthday = $12, email_address = $13, contact_number = $14, civil_status = $15, 
        youth_age_group = $16, work_status = $17, educational_background = $18, 
        registered_sk_voter = $19, registered_national_voter = $20
      WHERE id = $21 RETURNING *`;
    const values = [
      username,
      ...(password ? [hashedPassword] : []),
      firstname,
      lastname,
      street,
      province,
      city,
      barangay,
      zone,
      sex,
      birthdate,
      birthday,
      email_address,
      contact_number,
      civil_status,
      youth_age_group,
      work_status,
      educational_background,
      registered_sk_voter,
      registered_national_voter,
      id,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server error");
  }
});

/*router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { is_archived } = req.body;

  try {
    // Update the is_archived status in the database
    const result = await pool.query(
      "UPDATE reservations SET is_archived = $1 WHERE id = $2 RETURNING *",
      [is_archived, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation status updated successfully",
      reservation: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});*/

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing DELETE query:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
