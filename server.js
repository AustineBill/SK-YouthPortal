const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { generateRandomId } = require("./src/WebStructure/Codex");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" })); // Allow up to 20MB for JSON payloads
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Allow up to 20MB for URL-encoded payloads

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "iSKed",
  password: "iSKedWB2024",
  port: 5432,
});

app.use("/public", express.static(path.join(__dirname, "public")));

pool.query("SET timezone = 'UTC';");

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Connected to the database successfully.");
  }
});

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the iSKed API");
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Ensures SSL is used
  auth: {
    user: "austinebillryannmalic@gmail.com", // Your Gmail address
    pass: "htsyzbfwazgqmxzo", // Your app password for Gmail (don't use your regular Gmail password)
  },
});

/********* Website ******** */

const verificationCodes = {};

// Route to check email existence and send verification code
app.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM Users WHERE email_address = $1",
      [email]
    );

    if (result.rows.length > 0) {
      // Generate a verification code
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      verificationCodes[email] = verificationCode;

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
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 salt rounds

    // Update the password in the database
    await pool.query(
      "UPDATE users SET password = $1 WHERE email_address = $2",
      [hashedPassword, email]
    );

    // Remove the verification code (assuming a `verificationCodes` object is being used for email verification)
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

    // If the user exists, send the username and password back in the response for updating
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
  const { username, password } = req.body;

  try {
    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update query to modify both username and password
    const updateQuery = await pool.query(
      "UPDATE Users SET username = $1, password = $2 WHERE username = $3 RETURNING *",
      [username, hashedPassword, username]
    );

    if (updateQuery.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Account update failed: User not found" });
    }

    // Respond with success message
    res.status(200).json({
      message: "Account updated successfully",
      user: updateQuery.rows[0], // Send the updated user info if necessary
    });
  } catch (error) {
    console.error("Error during account update:", error);
    res.status(500).json({
      message: "An error occurred while updating your account",
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
    const adminResult = await pool.query("SELECT * FROM Admins WHERE username = $1", [username]);

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
    const userResult = await pool.query("SELECT * FROM Users WHERE username = $1", [username]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      // Validate password for user login (bcrypt used for users)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
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
          role: "user",  // Adding role for user
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

app.get("/Profile/:username", async (req, res) => {
  const username = req.params.username;
  //const userId = req.userId; // Assume userId is extracted from a secure session or token
  //WHERE id = $1 AND username = $1
  try {
    const query = `
        SELECT 
            id, username, firstname, lastname, region, province, city, barangay, zone,
            sex, age, birthday, email_address, contact_number, civil_status,
            youth_age_group, work_status, educational_background, 
            registered_sk_voter
        FROM Users
        WHERE username = $1
    `;
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/change-password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentPassword = user.rows[0].password;

    if (currentPassword !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      newPassword,
      id,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/reservations", async (req, res) => {
  const { user_id, reservation_type, start_date, end_date, status, time_slot } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Schedules (user_id, reservation_type, start_date, end_date, status, time_slot)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, reservation_type, start_date, end_date, status, time_slot]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).send("Server error");
  }
});
app.get("/reservations", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    const result = await pool.query(
      `SELECT id, reservation_type AS program, start_date AS date, end_date, status, time_slot 
         FROM Schedules 
         WHERE user_id = $1
         ORDER BY start_date ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Server error");
  }
});
app.post("/schedule/equipment", async (req, res) => {
  const { user_id, reservation_id, reservedEquipment, startDate, endDate } =
    req.body;

  // Convert the JavaScript Date object to an ISO string if it's not already
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
    // Query to fetch reservation data
    const result = await pool.query(
      `SELECT reservation_id, reserved_equipment, start_date, end_date
       FROM Equipment
       WHERE user_id = $1`,
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
app.delete("/reservations/:reservationId", async (req, res) => {
  const { reservationId } = req.params;

  try {
    // Delete the reservation using PostgreSQL query
    const result = await pool.query(
      "DELETE FROM Schedules WHERE id = $1 RETURNING *",
      [reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
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

/********* Auto Fill Details  *********
app.get('/Details/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT username, age, email_address AS email FROM Users WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching user details:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});
/******** View Schedules ********/
app.get("/ViewSched", async (req, res) => {
  try {
    const result = await pool.query(`
          SELECT 
              s.start_date, 
              s.end_date, 
              s.time_slot, 
              u.username, 
              s.reservation_type -- Include reservation_type in the response
          FROM Schedules s
          JOIN Users u ON s.user_id = u.id
          WHERE s.start_date >= CURRENT_DATE::date
          ORDER BY s.start_date ASC
      `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No schedules found" });
    }

    res.json(result.rows); // Send the result as a JSON response
  } catch (err) {
    console.error("Error during query execution:", err);
    res.status(500).json({ error: err.message }); // Send error message if there's an issue
  }
});

app.get("/ViewEquipment", async (req, res) => {
  try {
    // Query to fetch equipment details, using JSON functions to extract data
    const result = await pool.query(`
          SELECT 
              e.start_date, 
              e.end_date, 
              jsonb_array_elements(e.reserved_equipment) AS equipment
          FROM Equipment e
          WHERE e.start_date >= CURRENT_DATE
          ORDER BY e.start_date ASC
      `);

    // Map the result to extract equipment name and quantity
    const formattedResult = result.rows.map((row) => ({
      start_date: row.start_date,
      end_date: row.end_date,
      equipment_name: row.equipment.name,
      quantity: row.equipment.quantity,
    }));

    res.json(formattedResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/******** Inventory ********/

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

// Define multer storage configuration to save files in public/Asset
const Inventorystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public", "Equipment");
    // Make sure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // All files will be saved to the public/Asset directory
  },
  filename: (req, file, cb) => {
    // Sanitize the filename to prevent issues with special characters
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, sanitizedFilename); // Keep the original file name
  },
});

const upload = multer({ storage: Inventorystorage });

// Set up the storage engine for multer
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

app.post("/inventory", upload.single("image"), async (req, res) => {
  try {
    // Check if an image is uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const { name, quantity, specification, status } = req.body;
    const imageFileName = "/Equipment/" + req.file.filename; // Save only the relative path

    // Insert the item data into your database
    const query =
      "INSERT INTO inventory (name, quantity, specification, status, image) VALUES ($1, $2, $3, $4, $5)";
    const values = [name, quantity, specification, status, imageFileName];

    await pool.query(query, values);

    res.status(201).send("Item added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.get("/inventory", (req, res) => {
  pool
    .query("SELECT * FROM inventory")
    .then((result) => res.json(result.rows))
    .catch((error) => res.status(500).send(error.message));
});
app.put("/inventory/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, specification, status } = req.body;
    let query =
      "UPDATE inventory SET name = $1, quantity = $2, specification = $3, status = $4";
    const values = [name, quantity, specification, status];

    if (req.file) {
      const imageFileName = "/Equipment/" + req.file.filename;
      query += ", image = $5 WHERE id = $6";
      values.push(imageFileName, id);
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
app.delete("/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the item's image path to delete the file
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

    // Delete the item from the database
    await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
    res.status(200).send("Item deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
/***** Check Reservatoion *******/
app.post("/Checkreservation", async (req, res) => {
  const { user_id, date } = req.body;
  try {
    const query =
      "SELECT * FROM Schedules WHERE user_id = $1 AND DATE(start_date) = $2";
    const values = [user_id, date];
    const result = await pool.query(query, values);
    res.json({ exists: result.rowCount > 0 });
  } catch (error) {
    console.error("Error checking reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/CheckEquipment", async (req, res) => {
  const { user_id, date } = req.body;
  try {
    const query = `
      SELECT * FROM Equipment 
      WHERE user_id = $1 
      AND DATE(start_date AT TIME ZONE 'UTC') = $2
    `;
    const values = [user_id, date]; // Ensure date is ISO format
    const result = await pool.query(query, values);
    res.json({ exists: result.rowCount > 0 });
  } catch (error) {
    console.error("Error checking reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Admin Side
/********* Contact Us na ito ******** */
app.get("/contact", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT contact_number, location, gmail FROM public.contact WHERE id = $1",
      [1]
    );
    res.json(result.rows[0]); // Send the contact details
  } catch (error) {
    console.error("Error fetching contact details:", error);
    res.status(500).json({ error: "Error fetching contact details" });
  }
});
app.post("/Website", async (req, res) => {
  const { description, mandate, objectives, mission, vision } = req.body;

  // Validate the input data
  if (!description || !mandate || !objectives || !mission || !vision) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert a new entry into the Website table
    await pool.query(
      "INSERT INTO Website (description, mandate, objectives, mission, vision) VALUES ($1, $2, $3, $4, $5)",
      [description, mandate, objectives, mission, vision]
    );
    res.status(201).json({ message: "Website details added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding website details" });
  }
});
app.get("/Website", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Website WHERE id = $1", [1]);
    res.json(result.rows[0]); // Send the website details
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching website details" });
  }
});
app.put("/Website", async (req, res) => {
  const { description, mandate, objectives, mission, vision } = req.body;

  // Validate the input data
  if (!description || !mandate || !objectives || !mission || !vision) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Update website data in the Website table
    await pool.query(
      "UPDATE Website SET description = $1, mandate = $2, objectives = $3, mission = $4, vision = $5 WHERE id = $6",
      [description, mandate, objectives, mission, vision, 1]
    );
    res.json({ message: "Website details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating website details" });
  }
});
app.get("/api/sk", async (req, res) => {
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
            : `http://localhost:5000${url.replace("/Asset", "/public/Asset")}`,
        }));
      })
      .flat(); // Flatten the array of image URLs into a single array

    res.status(200).json(skcouncil);
  } catch (error) {
    console.error("Error fetching SK Council data:", error);
    res.status(500).json({ error: "Failed to fetch SK Photos data" });
  }
});

app.get("/Skcouncil", async (req, res) => {
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
              : `http://localhost:5000${url.replace(
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
app.post("/Skcouncil", skOfficialsupload.single("image"), async (req, res) => {
  // Ensure the file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = "/Asset/SK_Officials/" + req.file.filename; // Use the new unique filename path

  try {
    // Check if the image already exists in the database
    const existingRecord = await pool.query(
      "SELECT * FROM SkCouncil WHERE image = $1",
      [imagePath]
    );

    if (existingRecord.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Image with this filename already exists" });
    }

    // If no duplicate is found, insert the new record
    const result = await pool.query(
      "INSERT INTO SkCouncil (image) VALUES ($1) RETURNING *",
      [imagePath]
    );

    res.status(201).json({
      message: "Record added successfully",
      data: result.rows[0], // Return the newly added record
    });
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(500).json({ error: "Failed to add SkCouncil record" });
  }
});

// Edit an existing SkCouncil record
app.put(
  "/Skcouncil/:id",
  skOfficialsupload.single("image"),
  async (req, res) => {
    const { id } = req.params; // Get the id of the record from the URL parameter
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imagePath = "/Asset/SK_Officials/" + req.file.filename; // Generate the image path
    try {
      const result = await pool.query(
        "UPDATE SkCouncil SET image = $1 WHERE id = $2 RETURNING *",
        [imagePath, id] // Update the image column with the new file path
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

app.get("/spotlight", async (req, res) => {
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
            ? `http://localhost:5000${item.frontimage.replace(
                "/Asset",
                "/public/Asset"
              )}`
            : null,
          images: imageUrls.map((url) =>
            url.startsWith("http")
              ? url
              : `http://localhost:5000${url.replace("/Asset", "/public/Asset")}`
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

app.post(
  "/spotlight",
  Milestonesupload.array("additionalImages", 10), // Handle only additional images
  async (req, res) => {
    try {
      // Process additional images
      const additionalImages = req.files
        ? req.files.map((file) => `/Asset/Milestone/${file.filename}`)
        : [];

      if (additionalImages.length === 0) {
        return res.status(400).json({ error: "No additional images provided." });
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


// Update contact details
app.put("/contact", async (req, res) => {
  const { contact_number, location, gmail } = req.body;

  // Ensure all fields are provided
  if (!contact_number || !location || !gmail) {
    return res.status(400).json({
      error: "All fields (contact_number, location, gmail) are required",
    });
  }

  try {
    await pool.query(
      "UPDATE public.contact SET contact_number = $1, location = $2, gmail = $3 WHERE id = $4",
      [contact_number, location, gmail, 1]
    );
    res.json({ message: "Contact details updated successfully" });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({ error: "Error updating contact details" });
  }
});

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});
// Insert into the database with random ID generation
app.post("/users", async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming data

  const {
    username,
    password,
    firstname,
    lastname,
    region,
    province,
    city,
    barangay,
    zone,
    sex,
    age,
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

  // Generate a random 6-character ID
  const userId = generateRandomId(); // Call the random ID function

  try {
    // Check for duplicate user data
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
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds, you can adjust if needed

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO Users (
        id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, 
        birthday, email_address, contact_number, civil_status, youth_age_group, work_status, 
        educational_background, registered_sk_voter, registered_national_voter
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        userId,
        username,
        hashedPassword, // Store the hashed password
        firstname,
        lastname,
        region,
        province,
        city,
        barangay,
        zone,
        sex,
        age,
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
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    firstname,
    lastname,
    region,
    province,
    city,
    barangay,
    zone,
    sex,
    age,
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
    const result = await pool.query(
      `UPDATE users SET
              username = $1, password = $2, firstname = $3, lastname = $4, region = $5, province = $6, 
              city = $7, barangay = $8, zone = $9, sex = $10, age = $11, birthday = $12, 
              email_address = $13, contact_number = $14, civil_status = $15, youth_age_group = $16, 
              work_status = $17, educational_background = $18, registered_sk_voter = $19, 
              registered_national_voter = $20
          WHERE id = $21 RETURNING *`,
      [
        username,
        password,
        firstname,
        lastname,
        region,
        province,
        city,
        barangay,
        zone,
        sex,
        age,
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
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server error");
  }
});
app.delete("/users/:id", async (req, res) => {
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
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

//admin dashboard
//admin dashboard start
// Add this new route to fetch the required user stats for the dashboard
/*app.get('/admindashboard', async (req, res) => {
  try {
    // Query to get the total number of users
    const usersResult = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    
    // Query to get the total number of schedules
    const schedulesResult = await pool.query('SELECT COUNT(*) AS total_schedules FROM schedules');
    
    // Query to get the total number of equipment
    const equipmentResult = await pool.query('SELECT COUNT(*) AS total_equipment FROM equipment');
    
    if (
      usersResult.rows.length > 0 &&
      schedulesResult.rows.length > 0 &&
      equipmentResult.rows.length > 0
    ) {
      res.json({
        total_users: usersResult.rows[0].total_users,
        total_schedules: schedulesResult.rows[0].total_schedules,
        total_equipment: equipmentResult.rows[0].total_equipment
      });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});*/

// Assuming you have the 'pool' object for your database connection (pg module).
app.get("/admindashboard", async (req, res) => {
  const { year } = req.query; // Get the year from the query parameter

  try {
    // SQL query to fetch the dashboard data
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM "Users" WHERE $1::int IS NULL OR EXTRACT(YEAR FROM created_at) = $1) AS total_users,
        (SELECT COUNT(*) FROM "Schedules" WHERE $1::int IS NULL OR EXTRACT(YEAR FROM created_at) = $1) AS total_reservations,
        (SELECT COUNT(*) FROM "Equipment" WHERE $1::int IS NULL OR EXTRACT(YEAR FROM created_at) = $1) AS total_equipment,
        (SELECT json_agg(feedback) 
         FROM "feedback" 
         WHERE $1::int IS NULL OR EXTRACT(YEAR FROM created_at) = $1) AS feedback_data
    `;

    const values = [year ? parseInt(year, 10) : null];

    // Execute the query
    const result = await pool.query(query, values);

    // Return the dashboard data along with feedback data
    res.json({
      total_users: result.rows[0].total_users || 0,
      total_reservations: result.rows[0].total_reservations || 0,
      total_equipment: result.rows[0].total_equipment || 0,
      feedback_data: result.rows[0].feedback_data || [], // Handle empty feedback data
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/Allreservations", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reservation_type AS program, start_date AS date, end_date, status, time_slot 
       FROM Schedules 
       ORDER BY start_date ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Server error");
  }
});
app.post("/approveReservations", async (req, res) => {
  const { ids } = req.body; // Array of reservation IDs to approve

  try {
    // Update the status of the selected reservations
    await pool.query(
      "UPDATE Schedules SET status = $1 WHERE id = ANY($2::int[])",
      ["Approved", ids]
    );
    res.status(200).send("Reservations approved");
  } catch (error) {
    console.error("Error approving reservations:", error);
    res.status(500).send("Server error");
  }
});
app.post("/disapproveReservations", async (req, res) => {
  const { ids } = req.body; // Array of reservation IDs to disapprove

  try {
    // Update the status of the selected reservations to 'Disapproved'
    await pool.query(
      "UPDATE Schedules SET status = $1 WHERE id = ANY($2::int[])",
      ["Disapproved", ids]
    );
    res.status(200).send("Reservations disapproved");
  } catch (error) {
    console.error("Error disapproving reservations:", error);
    res.status(500).send("Server error");
  }
});
app.get("/Allequipments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, reservation_id, start_date, end_date, reserved_equipment, status
       FROM Equipment 
       ORDER BY start_date ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching equipment reservations:", error);
    res.status(500).send("Server error");
  }
});
// Route to approve equipment reservations
app.post("/approveEquipment", async (req, res) => {
  const { ids } = req.body; // Array of reservation IDs to approve
  try {
    await pool.query(
      "UPDATE Equipment SET status = $1 WHERE id = ANY($2::int[])",
      ["Approved", ids]
    );
    res.status(200).send("Equipment reservations approved");
  } catch (error) {
    console.error("Error approving equipment reservations:", error);
    res.status(500).send("Server error");
  }

  app.post("/disapproveEquipment", async (req, res) => {
    const { ids } = req.body; // Array of reservation IDs to approve
    try {
      await pool.query(
        "UPDATE Equipment SET status = $1 WHERE id = ANY($2::int[])",
        ["Disapproved", ids]
      );
      res.status(200).send("Equipment reservations approved");
    } catch (error) {
      console.error("Error approving equipment reservations:", error);
      res.status(500).send("Server error");
    }
  });
});

//Manage Website

app.get("/api/programs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Programs");
    const programs = result.rows.map((program) => {
      // Check if image_url is null or undefined before attempting to use startsWith
      const imageUrl = program.image_url
        ? program.image_url.startsWith("http")
          ? program.image_url
          : `http://localhost:5000${program.image_url.replace(
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

app.get("/api/programs/:programType", async (req, res) => {
  const { programType } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Programs WHERE program_type = $1",
      [programType]
    );
    const program = result.rows[0]; // Assuming you're only fetching one program based on type
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

const ProgramStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Asset/Programs"); // Store in the desired folder
  },
  filename: (req, file, cb) => {
    // Retain the original filename and just add a suffix to ensure uniqueness
    const fileName = file.originalname.replace(/\s+/g, "_"); // Optionally replace spaces with underscores
    cb(null, fileName); // Save the file with its original name
  },
});
const Programupload = multer({ storage: ProgramStorage });

app.post(
  "/programs",
  Programupload.array("amenities", 10),
  async (req, res) => {
    const { program_name, description, heading, program_type } = req.body;
    const amenities = req.files.map(
      (file) => `/Asset/Programs/${file.filename}`
    );
    const image_url = req.files[0]
      ? `/Asset/Programs/${req.files[0].filename}`
      : null; // Assuming first file is the main image

    try {
      const result = await pool.query(
        "INSERT INTO Programs (program_name, heading, description, amenities, image_url, program_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [program_name, heading, description, amenities, image_url, program_type]
      );
      res.status(201).json(result.rows[0]); // Return newly added program
    } catch (error) {
      console.error("Error adding program:", error);
      res.status(500).send("Error adding program");
    }
  }
);

app.get("/programs/:id", async (req, res) => {
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

app.put("/programs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    program_name,
    description,
    heading,
    amenities,
    image_url,
    program_type,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE programs SET program_name = $1, description = $2, heading = $3, amenities = $4, image_url = $5, program_type = $6 WHERE id = $7 RETURNING *",
      [
        program_name,
        description,
        heading,
        amenities,
        image_url,
        program_type,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Program not found");
    }

    res.json(result.rows[0]); // Send back the updated program as a response
  } catch (err) {
    console.error("Error updating program:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/programs/:id", async (req, res) => {
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

app.get("/events", async (req, res) => {
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
app.get("/events/:id", async (req, res) => {
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

app.post("/events", Eventupload.single("event_image"), async (req, res) => {
  const { event_name, event_description } = req.body;

  try {
    const event_image = `/Asset/Events/${req.file.filename}`; // Construct the file path
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
app.put("/events/:id", async (req, res) => {
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
app.delete("/events/:id", async (req, res) => {
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

app.get("/user-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user data");
  }
});

// Route for fetching equipment reservations
app.get("/equipment-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching equipment data");
  }
});

// Route for fetching gym reservations (schedules)
app.get("/schedule-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schedules");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching schedules data");
  }
});

// Route for fetching inventory data
app.get("/inventory-reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching inventory data");
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
              <a href="http://localhost:5000/reset-password?token=${resetToken}">Reset Password</a>
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
