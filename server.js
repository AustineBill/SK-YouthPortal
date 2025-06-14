const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const { Pool } = require("pg");

const { generateRandomId } = require("./src/WebStructure/Codex");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use("/public", express.static(path.join(__dirname, "public")));

const reserveRoutes = require("./src/Backend/Routes/reservations");
const inventoryRoutes = require("./src/Backend/Routes/inventory");
const equipmentRoutes = require("./src/Backend/Routes/equipment");
const featureRoutes = require("./src/Backend/Routes/feature");
const usersRoutes = require("./src/Backend/Routes/users");

const websiteRoutes = require("./src/Backend/Routes/website");

//const adminRoutes = require("./src/Backend/Routes/Admin/admin");
const eventRoutes = require("./src/Backend/Routes/Admin/events");
const programRoutes = require("./src/Backend/Routes/Admin/program");
const spotlightRoutes = require("./src/Backend/Routes/Admin/spotlight");

const reportRoutes = require("./src/Backend/Routes/Admin/reports");
const statusRoutes = require("./src/Backend/Routes/Admin/status");

pool.query("SET timezone = 'UTC';");

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Connected to the database successfully.");
  }
});

app.use(reserveRoutes);
app.use(equipmentRoutes);
app.use(inventoryRoutes);
app.use(featureRoutes);
app.use(usersRoutes);

app.use(eventRoutes);
app.use(programRoutes);
app.use(spotlightRoutes);
app.use(reportRoutes);
app.use(statusRoutes);
app.use(websiteRoutes);

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the iSKed API");
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your actual secret key
});

/**
 * Function to upload an image to Cloudinary
 * @param {string} path - The file path of the image to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
async function uploadImage(path) {
  try {
    const uniquePublicId = `image_${Date.now()}`; // Generate unique public_id
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: uniquePublicId,
    });
    return uploadResult.secure_url; // Return only the secure URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Propagate error for the caller to handle
  }
}

module.exports = { uploadImage };

/********* Website ******** */

const verificationCodes = {};
const emailTimestamps = {};

// Route to check email existence and send verification code
app.post("/check-email", async (req, res) => {
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
      // Generate a verification code
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      verificationCodes[email] = verificationCode;
      emailTimestamps[email] = currentTime; // Update the timestamp for this email

      // Send email with the verification code
      await transporter.sendMail({
        from: '"SK Western Bicutan" <austinebillryannmalic@gmail.com>',
        to: email,
        subject: "Password Reset Verification Code",
        text: `Your verification code is: ${verificationCode}`,
      });

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
app.post("/verify-code", (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] === verificationCode) {
    res.json({ success: true, message: "Verification code is correct." });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Incorrect verification code." });
  }
});

app.post("/change-password", async (req, res) => {
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

app.post("/ValidateCode", async (req, res) => {
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
app.post("/UpdateAccount", async (req, res) => {
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

app.put("/updateUser", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.post("/schedule/equipment", async (req, res) => {
  const { user_id, reservation_id, reservedEquipment, startDate, endDate } =
    req.body;

  const startDateISO = new Date(startDate).toISOString();
  const endDateISO = new Date(endDate).toISOString();

  // Convert startDate and endDate to 'Asia/Manila' timezone using moment-timezone
  const startDateManila = moment(startDateISO)
    .tz("Asia/Manila")
    .format("YYYY-MM-DD HH:mm:ss");
  const endDateManila = moment(endDateISO)
    .tz("Asia/Manila")
    .format("YYYY-MM-DD HH:mm:ss");

  let client;
  try {
    client = await pool.connect(); // Acquire a client from the pool
    await client.query("BEGIN"); // Start the transaction

    // Step 1: Insert the reservation into the Equipment table
    const result = await client.query(
      `INSERT INTO Equipment (user_id, reservation_id, start_date, end_date, reserved_equipment)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        user_id,
        reservation_id,
        startDateManila, // Use the converted start date
        endDateManila, // Use the converted end date
        JSON.stringify(reservedEquipment),
      ]
    );

    const reservationId = result.rows[0].id;

    // Step 2: Update inventory by reducing the quantity
    for (const equipment of reservedEquipment) {
      const { id, quantity } = equipment;

      // Check if there is enough stock
      const inventoryCheckQuery =
        "SELECT quantity FROM Inventory WHERE id = $1";
      const inventoryCheckResult = await client.query(inventoryCheckQuery, [
        id,
      ]);

      if (
        inventoryCheckResult.rowCount === 0 ||
        inventoryCheckResult.rows[0].quantity < quantity
      ) {
        // If not enough stock, rollback transaction and send error
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: `Not enough stock for ${equipment.name}` });
      }

      // Update the inventory by reducing the quantity
      const updateInventoryQuery =
        "UPDATE Inventory SET quantity = quantity - $1 WHERE id = $2";
      await client.query(updateInventoryQuery, [quantity, id]);
    }

    // Commit transaction after successful operations
    await client.query("COMMIT");

    // Return the reservation details (with the inserted reservation ID)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (client) await client.query("ROLLBACK"); // Rollback if an error occurs
    console.error("Error saving reservation:", error.message); // Log the error message
    res.status(500).json({ error: error.message, stack: error.stack });
  } finally {
    if (client) client.release(); // Release the client back to the pool
  }
});

app.get("/schedule/equipment", async (req, res) => {
  const { userId } = req.query;
  try {
    // Query to fetch reservation data excluding archived (deleted) ones
    const result = await pool.query(
      `SELECT reservation_id, reserved_equipment, start_date, end_date, status
       FROM Equipment
       WHERE user_id = $1 AND (is_archived IS NULL OR is_archived = FALSE OR is_archived != 't')`,
      [userId]
    );

    // Process each reservation and check if equipment is reserved
    const equipmentData = result.rows.map((row) => {
      let equipmentInfo = "No Equipment Reserved"; // Default value for no equipment
      if (row.reserved_equipment) {
        try {
          // Handle cases where reserved_equipment is an array of arrays
          let reservedEquipment = row.reserved_equipment;
          // If it's an array of arrays, flatten it to a single array of objects
          if (
            Array.isArray(reservedEquipment) &&
            reservedEquipment[0] &&
            Array.isArray(reservedEquipment[0])
          ) {
            reservedEquipment = reservedEquipment.flat();
          }
          // Ensure it's an array of objects before processing
          if (Array.isArray(reservedEquipment)) {
            // Format each equipment item as "name - quantity"
            equipmentInfo = reservedEquipment
              .map((item) => {
                if (item && typeof item === "object") {
                  // If the item is an object, extract the name and quantity
                  const name = item.name || "Unknown Item";
                  const quantity = item.quantity || 0;
                  return `${name} - ${quantity}`;
                }
                return "Invalid equipment data"; // Handle invalid data
              })
              .join(", "); // Join the items with a comma
          } else {
            equipmentInfo = "Invalid equipment data"; // Handle non-array data
          }
        } catch (error) {
          // Log any error that happens during JSON parsing
          console.error("Error processing reserved equipment:", error);
          equipmentInfo = "Error processing equipment details"; // Set error message for faulty data
        }
      }

      return {
        reservation_id: row.reservation_id,
        reserved_equipment: equipmentInfo,
        start_date: new Date(row.start_date).toLocaleString(), // Ensure date formatting
        end_date: new Date(row.end_date).toLocaleString(), // Ensure date formatting
        status: row.status || "Pending",
      };
    });

    // If no equipment is reserved, return an empty array
    res.status(200).json(equipmentData.length > 0 ? equipmentData : []);
  } catch (error) {
    // Log any error that happens during the database query or data processing
    console.error("Error fetching equipment reservations:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/reservations/:reservationId", async (req, res) => {
  const { reservationId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM Schedules WHERE id = $1", [
      reservationId,
    ]); // Use pool.query()
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the reservation details back
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/reservations/:reservationId", async (req, res) => {
  const { reservationId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE Schedules SET is_archived = true WHERE id = $1 RETURNING *",
      [reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation archived successfully" });
  } catch (error) {
    console.error("Error archiving reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/equipment/:reservationId", async (req, res) => {
  const { reservationId } = req.params;

  try {
    const result = await pool.query(
      `SELECT reservation_id, reserved_equipment, start_date, end_date
       FROM Equipment
       WHERE reservation_id = $1`,
      [reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Reservation not found");
    }

    const row = result.rows[0];
    let equipmentInfo = "No Equipment Reserved"; // Default value for no equipment

    if (row.reserved_equipment) {
      let reservedEquipment = row.reserved_equipment;
      // Handle array of arrays (if any)
      if (
        Array.isArray(reservedEquipment) &&
        reservedEquipment[0] &&
        Array.isArray(reservedEquipment[0])
      ) {
        reservedEquipment = reservedEquipment.flat();
      }
      if (Array.isArray(reservedEquipment)) {
        equipmentInfo = reservedEquipment
          .map((item) => {
            const name = item.name || "Unknown Item";
            const quantity = item.quantity || 0;
            return `${name} - ${quantity}`;
          })
          .join(", ");
      }
    }

    res.status(200).json({
      reservation_id: row.reservation_id,
      reserved_equipment: equipmentInfo,
      start_date: new Date(row.start_date).toLocaleString(),
      end_date: new Date(row.end_date).toLocaleString(),
    });
  } catch (error) {
    console.error("Error fetching equipment reservation details:", error);
    res.status(500).send("Error fetching equipment reservation details");
  }
});

app.patch("/equipment/:id", async (req, res) => {
  const { id } = req.params; // Using 'id' instead of 'reservationId'

  try {
    const reservationResult = await pool.query(
      "SELECT * FROM Equipment WHERE id = $1",
      [id]
    );

    if (reservationResult.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const reservedEquipment = reservationResult.rows[0].reserved_equipment;
    let equipmentList;
    if (typeof reservedEquipment === "string") {
      equipmentList = JSON.parse(reservedEquipment);
    } else {
      equipmentList = reservedEquipment;
    }

    for (const equipment of equipmentList) {
      const { id, quantity } = equipment;

      const updateInventoryResult = await pool.query(
        "UPDATE Inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
        [quantity, id]
      );

      if (updateInventoryResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Equipment with id ${id} not found in inventory` });
      }
    }

    const archiveReservationResult = await pool.query(
      "UPDATE Equipment SET is_archived = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (archiveReservationResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Reservation not found or already archived" });
    }

    res.status(200).json({
      message:
        "Reservation archived and equipment quantity updated successfully",
    });
  } catch (error) {
    console.error("Error archiving reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/equipment/:reservation_id", async (req, res) => {
  const { reservation_id } = req.params;

  try {
    // Step 1: Get the reservation details to identify the reserved equipment
    const reservationResult = await pool.query(
      "SELECT * FROM Equipment WHERE reservation_id = $1",
      [reservation_id]
    );

    if (reservationResult.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Step 2: Get reserved equipment
    const reservedEquipment = reservationResult.rows[0].reserved_equipment;

    // Step 3: Check if reserved_equipment is a string and parse it if necessary
    let equipmentList;
    if (typeof reservedEquipment === "string") {
      // Parse the JSON string if it's in string format
      equipmentList = JSON.parse(reservedEquipment);
    } else {
      // If it's already an object/array, use it directly
      equipmentList = reservedEquipment;
    }

    // Step 4: Update the inventory for each equipment in the reservation
    for (const equipment of equipmentList) {
      const { id, quantity } = equipment;

      // Update the inventory by increasing the quantity of the equipment
      const updateInventoryResult = await pool.query(
        "UPDATE Inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
        [quantity, id]
      );

      if (updateInventoryResult.rowCount === 0) {
        return res
          .status(404)
          .json({ message: `Equipment with id ${id} not found in inventory` });
      }
    }

    // Step 5: Delete the reservation record
    const deleteReservationResult = await pool.query(
      "DELETE FROM Equipment WHERE reservation_id = $1 RETURNING *",
      [reservation_id]
    );

    if (deleteReservationResult.rowCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Step 6: Return success response
    res.status(200).json({
      message:
        "Reservation cancelled and equipment quantity updated successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/********* Auto Fill Details  *********/
app.get("/Details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT username, birthdate, email_address AS email FROM Users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/***** Check Reservatoion *******/
app.post("/ValidateReservation", async (req, res) => {
  const { user_id, start_date, end_date } = req.body;

  try {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Query to check for overlapping reservations only for this user
    const overlapQuery = `
      SELECT * FROM Schedules 
      WHERE user_id = $1
      AND (is_archived IS NULL OR is_archived = FALSE) -- Exclude archived reservations
      AND (
        (start_date <= $2 AND end_date >= $2) OR -- Overlap with new start date
        (start_date <= $3 AND end_date >= $3) OR -- Overlap with new end date
        (start_date >= $2 AND end_date <= $3)    -- Fully contained within new range
      )
    `;
    const overlapValues = [user_id, startDate, endDate];
    const overlapResult = await pool.query(overlapQuery, overlapValues);

    // If any rows are returned, there is an overlap
    if (overlapResult.rowCount > 0) {
      return res.json({
        success: false,
        message: "You already have a reservation overlapping these dates.",
      });
    }

    // If no overlaps, allow the reservation
    return res.json({ success: true, message: "Reservation allowed." });
  } catch (error) {
    console.error("Error validating reservation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/CheckEquipment", async (req, res) => {
  const { user_id, date } = req.body;
  try {
    const query = `
      SELECT * FROM Equipment 
      WHERE user_id = $1 
      AND DATE(start_date AT TIME ZONE 'UTC') = $2
      AND (is_archived IS NULL OR is_archived = FALSE OR is_archived != 't') -- Exclude archived equipment
    `;
    const values = [user_id, date]; // Ensure date is in ISO format
    const result = await pool.query(query, values);
    res.json({ exists: result.rowCount > 0 });
  } catch (error) {
    console.error("Error checking reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Admin Side

app.get("/date-settings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM date_settings ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get the single time setting (only one row exists)
app.get("/time-settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_settings LIMIT 1");
    res.json(result.rows[0] || {}); // Return empty object if no data exists
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/settings", async (req, res) => {
  try {
    const timeGapResult = await pool.query(`
      SELECT time_gap FROM settings 
      WHERE time_gap IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    const timeGap =
      timeGapResult.rows.length > 0 ? timeGapResult.rows[0].time_gap : 1;

    // Get blocked dates
    const blockedDatesResult = await pool.query(`
      SELECT start_date, end_date FROM settings 
      WHERE start_date IS NOT NULL
    `);

    res.json({
      blocked_dates: blockedDatesResult.rows,
      time_gap: timeGap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/settings/time-gap", async (req, res) => {
  try {
    const { time_gap } = req.body;

    if (!time_gap || isNaN(time_gap)) {
      return res.status(400).json({ error: "Invalid time gap value!" });
    }

    // Check if time_settings already has a row
    const checkExisting = await pool.query(
      "SELECT * FROM time_settings LIMIT 1"
    );

    if (checkExisting.rowCount === 0) {
      // Insert if no row exists
      await pool.query(
        "INSERT INTO time_settings (id, time_gap) VALUES (TRUE, $1)",
        [time_gap]
      );
    } else {
      // Update if a row exists
      await pool.query(
        "UPDATE time_settings SET time_gap = $1, created_at = NOW()",
        [time_gap]
      );
    }

    res.json({ message: "Time gap updated successfully!" });
  } catch (err) {
    console.error("Error updating time gap:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Insert blocked date range
app.post("/settings/block-dates", async (req, res) => {
  const { start_date, end_date } = req.body;

  if (!start_date) {
    return res.status(400).json({ error: "Start date is required" });
  }

  try {
    await pool.query(
      "INSERT INTO date_settings (start_date, end_date) VALUES ($1, $2);",
      [start_date, end_date || null]
    );
    res.json({ message: "Blocked date range added successfully" });
  } catch (error) {
    console.error("Error inserting blocked dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/settings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM settings WHERE id = $1", [id]);
    res.send("Block date removed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/admindashboard", async (req, res) => {
  const { year } = req.query;

  try {
    const selectedYear = year ? parseInt(year, 10) : new Date().getFullYear();
    const mainQuery = `
      SELECT 
        EXTRACT(YEAR FROM created_at) AS year,
        COUNT(*) AS total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_users,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_users,
        (SELECT COUNT(*) FROM "schedules" WHERE EXTRACT(YEAR FROM created_at) = COALESCE($1, EXTRACT(YEAR FROM CURRENT_DATE))) AS total_reservations,
        (SELECT COUNT(*) FROM "equipment" WHERE EXTRACT(YEAR FROM created_at) = COALESCE($1, EXTRACT(YEAR FROM CURRENT_DATE))) AS total_equipment,
        (SELECT json_agg(feedback) 
         FROM "feedback" 
         WHERE EXTRACT(YEAR FROM created_at) = COALESCE($1, EXTRACT(YEAR FROM CURRENT_DATE))) AS feedback_data
      FROM "users"
      WHERE EXTRACT(YEAR FROM created_at) = COALESCE($1, EXTRACT(YEAR FROM CURRENT_DATE))
      GROUP BY EXTRACT(YEAR FROM created_at);
    `;

    const monthlySchedulesQuery = `
      SELECT
        EXTRACT(MONTH FROM created_at) AS month,
        COUNT(*) AS total_reservations
      FROM "schedules"
      WHERE EXTRACT(YEAR FROM created_at) = $1
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at);
    `;

    const monthlyEquipmentQuery = `
      SELECT
        EXTRACT(MONTH FROM created_at) AS month,
        COUNT(*) AS total_equipment_reservations
      FROM "equipment"
      WHERE EXTRACT(YEAR FROM created_at) = $1
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at);
    `;

    // Query for yearly rating counts (1 to 5) from the "feedback" table
    const yearlyRatingsQuery = `
      SELECT 
        rating, 
        COUNT(*) AS rating_count
      FROM "feedback"
      WHERE EXTRACT(YEAR FROM created_at) = $1
      GROUP BY rating
      ORDER BY rating;
    `;
    const values = [selectedYear];
    const [mainResult, schedulesResult, equipmentResult, ratingsResult] =
      await Promise.all([
        pool.query(mainQuery, values),
        pool.query(monthlySchedulesQuery, values),
        pool.query(monthlyEquipmentQuery, values),
        pool.query(yearlyRatingsQuery, values),
      ]);

    if (!mainResult.rows.length) {
      return res
        .status(404)
        .json({ message: `No data found for the year ${selectedYear}` });
    }

    // Map the monthly data into arrays for easier use in the frontend
    const monthlySchedules = new Array(12).fill(0);
    const monthlyEquipment = new Array(12).fill(0);

    schedulesResult.rows.forEach((row) => {
      monthlySchedules[row.month - 1] = parseInt(row.total_reservations, 10);
    });

    equipmentResult.rows.forEach((row) => {
      monthlyEquipment[row.month - 1] = parseInt(
        row.total_equipment_reservations,
        10
      );
    });

    // Prepare the ratings data (1-5) from the query result
    const ratingsCount = [0, 0, 0, 0, 0]; // Index 0 corresponds to rating 1, index 4 corresponds to rating 5
    ratingsResult.rows.forEach((row) => {
      ratingsCount[row.rating - 1] = row.rating_count; // Place the count of each rating in the corresponding index
    });

    // Return the dashboard data, including active and inactive users
    res.json({
      total_users: mainResult.rows[0].total_users || 0,
      active_users: mainResult.rows[0].active_users || 0, // Active users count
      inactive_users: mainResult.rows[0].inactive_users || 0, // Inactive users count
      total_reservations: mainResult.rows[0].total_reservations || 0,
      total_equipment: mainResult.rows[0].total_equipment || 0,
      feedback_data: mainResult.rows[0].feedback_data || [], // Handle empty feedback data
      monthly_reservations: monthlySchedules, // Monthly data for schedules
      monthly_equipment_reservations: monthlyEquipment, // Monthly data for equipment
      yearly_ratings: ratingsCount, // Ratings data for 1-5 scale
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/Allequipments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, reservation_id, start_date, end_date, reserved_equipment, status
       FROM Equipment 
       WHERE is_archived IS DISTINCT FROM true
       ORDER BY start_date ASC`
    );

    const formattedResult = result.rows.map((row) => ({
      ...row,
      reserved_equipment:
        typeof row.reserved_equipment === "string"
          ? JSON.parse(row.reserved_equipment)
          : row.reserved_equipment,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error("Error fetching equipment reservations:", error);
    res.status(500).send("Server error");
  }
});

app.get("/Allreservations", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reservation_id, user_id, reservation_type AS program, 
       TO_CHAR(start_date, 'FMDay, FMMonth FMDD, YYYY') AS start_date, 
       TO_CHAR(end_date, 'FMDay, FMMonth FMDD, YYYY') AS end_date, 
       status, time_slot 
      FROM Schedules 
      WHERE is_archived IS DISTINCT FROM true
      ORDER BY start_date ASC;
`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Server error");
  }
});

// Forgot Password - Send Verification Code
app.post("/forgot-password", async (req, res) => {
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
app.post("/reset-password", async (req, res) => {
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

// Function to increment birthdate and update status
async function updateAgeAndStatus() {
  try {
    // Update the birthdate for users with birthdays today
    const updateAgeQuery = `
      UPDATE Users
      SET birthdate = birthdate + 1
      WHERE EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM birthday)
        AND EXTRACT(DAY FROM CURRENT_DATE) = EXTRACT(DAY FROM birthday);
    `;
    await pool.query(updateAgeQuery);

    // Update the status to 'inactive' for users 31 or older
    const updateStatusQuery = `
      UPDATE Users
      SET status = 'inactive'
      WHERE birthdate >= 31;
    `;
    await pool.query(updateStatusQuery);

    console.log("Age and status updated successfully.");
  } catch (err) {
    console.error("Error updating birthdate and status:", err);
  }
}

// Schedule the task to run once a day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running the birthdate and status update task...");
  updateAgeAndStatus();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
