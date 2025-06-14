const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
const { generateRandomId } = require("../Utils/encrypt");

generateRandomId;

const { sendEmail } = require("../Utils/email");

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const verificationCodes = {};
const emailTimestamps = {};

// Route to check email existence and send verification code
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const currentTime = Date.now();

  try {
    if (
      emailTimestamps[email] &&
      currentTime - emailTimestamps[email] < 3 * 60 * 1000
    ) {
      const remainingTime = Math.ceil(
        (3 * 60 * 1000 - (currentTime - emailTimestamps[email])) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting another code.`,
      });
    }

    const result = await pool.query(
      "SELECT * FROM Users WHERE email_address = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      verificationCodes[email] = verificationCode;
      emailTimestamps[email] = currentTime;

      // ✅ Use utility function to send the email
      await sendEmail(email, verificationCode);

      res.json({ success: true, message: "Verification code sent to email." });
    } else {
      res.status(404).json({ success: false, message: "Email not found." });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Route to verify the code
router.post("/verify-code", (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] === verificationCode) {
    res.json({ success: true, message: "Verification code is correct." });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Incorrect verification code." });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 salt rounds

    await pool.query(
      "UPDATE users SET password = $1 WHERE email_address = $2",
      [hashedPassword, email]
    );
    if (verificationCodes[email]) {
      delete verificationCodes[email];
    }

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/ValidateCode", async (req, res) => {
  const { activationCode } = req.body;
  try {
    const activationCodeTrimmed = activationCode.toString().trim();
    const user = await pool.query(
      "SELECT username, password FROM Users WHERE id = $1",
      [activationCodeTrimmed]
    );

    if (user.rowCount === 0) {
      return res.status(400).json({ message: "Invalid Activation Code" });
    }

    res.status(200).json({
      message:
        "Activation code validated. Please change your username and password.",
      username: user.rows[0].username,
      password: user.rows[0].password,
    });
  } catch (error) {
    console.error("Error during validation:", error);
    res.status(500).json({ message: "An error occurred during validation" });
  }
});
router.post("/UpdateAccount", async (req, res) => {
  const { decryptedCode, username, password } = req.body;

  try {
    if (!decryptedCode || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Retrieve the existing user details
    const userQuery = await pool.query("SELECT * FROM Users WHERE id = $1", [
      decryptedCode,
    ]);

    if (userQuery.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingUser = userQuery.rows[0];

    // Check if username or password has changed
    const isUsernameChanged = existingUser.username !== username;
    const isPasswordChanged = !(await bcrypt.compare(
      password,
      existingUser.password
    ));

    if (!isUsernameChanged && !isPasswordChanged) {
      return res.status(400).json({
        message: "No changes detected. Username or password must be updated.",
      });
    }

    // Hash the new password if it has changed
    const hashedPassword = isPasswordChanged
      ? await bcrypt.hash(password, 10)
      : existingUser.password;

    // Update the user with new username, password, and set status to active
    const updateQuery = await pool.query(
      `UPDATE Users 
       SET username = $1, password = $2, status = 'active'
       WHERE id = $3 
       RETURNING *`,
      [username, hashedPassword, decryptedCode]
    );

    res.status(200).json({
      message: "Account updated successfully. Status set to active.",
      user: {
        id: updateQuery.rows[0].id,
        username: updateQuery.rows[0].username,
        status: updateQuery.rows[0].status,
      },
    });
  } catch (error) {
    console.error("Error during account update:", error);
    res.status(500).json({
      message: "An error occurred while updating your account.",
      error: error.message,
    });
  }
});

router.put("/updateUser", async (req, res) => {
  const { userId, username, password, newPassword } = req.body;

  try {
    // Find the user by ID (using raw SQL)
    const userResult = await pool.query("SELECT * FROM Users WHERE id = $1", [
      userId,
    ]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the username already exists
    const existingUser = await pool.query(
      "SELECT * FROM Users WHERE username = $1",
      [username]
    );
    if (existingUser.rowCount > 0 && existingUser.rows[0].id !== userId) {
      return res
        .status(400)
        .json({ message: "Username already taken by another user." });
    }

    // Check if password matches current password (using bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Hash the new password before saving to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user info (username and password) in the database
    await pool.query(
      "UPDATE Users SET username = $1, password = $2 WHERE id = $3",
      [username, hashedPassword, userId]
    );

    return res.status(200).json({ message: "User info updated successfully!" });
  } catch (error) {
    console.error("Error during update:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating user info." });
  }
});

// Forgot Password - Send Verification Code
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email address in the database
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email_address = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Email address not found" });
    }

    const user = userResult.rows[0];

    // Generate a reset password token and its expiration
    const resetToken = generateRandomId(); // Unique random token
    const resetTokenExpiration = moment().add(1, "hour").toISOString(); // Token expires in 1 hour

    // Store token and expiration date in the database (hash the token for security)
    const hashedToken = bcrypt.hashSync(resetToken, 10);
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiration = $2 WHERE email_address = $3",
      [hashedToken, resetTokenExpiration, email]
    );

    // Send reset password email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
              <h1>Password Reset</h1>
              <p>You requested a password reset. Please click the link below to reset your password:</p>
              <a href="https://isked-backend-ssmj.onrender.com/reset-password?token=${resetToken}">Reset Password</a>
          `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});
// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Find the user in the database and retrieve the reset token and expiration
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email_address = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Check if the reset token exists and if it is still valid
    const isTokenValid = bcrypt.compareSync(token, user.reset_token);

    if (
      !isTokenValid ||
      Date.now() > new Date(user.reset_token_expiration).getTime()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await pool.query(
      "UPDATE users SET password = $1 WHERE email_address = $2",
      [hashedPassword, email]
    );

    // Clear the reset token and expiration
    await pool.query(
      "UPDATE users SET reset_token = NULL, reset_token_expiration = NULL WHERE email_address = $1",
      [email]
    );

    res.status(200).json({ message: "Password successfully updated!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

module.exports = router;
