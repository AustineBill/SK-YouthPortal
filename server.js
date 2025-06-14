const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const moment = require("moment-timezone");
const { Pool } = require("pg");

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

const authRoutes = require("./src/Backend/Routes/authentication");
const registrationRoutes = require("./src/Backend/Routes/registration");

const reserveRoutes = require("./src/Backend/Routes/reservations");
const inventoryRoutes = require("./src/Backend/Routes/inventory");
const equipmentRoutes = require("./src/Backend/Routes/equipment");
const featureRoutes = require("./src/Backend/Routes/feature");
const usersRoutes = require("./src/Backend/Routes/users");

const websiteRoutes = require("./src/Backend/Routes/website");
const settingsRoutes = require("./src/Backend/Routes/settings");

//const adminRoutes = require("./src/Backend/Routes/Admin/admin");
const eventRoutes = require("./src/Backend/Routes/Admin/events");
const programRoutes = require("./src/Backend/Routes/Admin/program");
const spotlightRoutes = require("./src/Backend/Routes/Admin/spotlight");

const reportRoutes = require("./src/Backend/Routes/Admin/reports");
const statusRoutes = require("./src/Backend/Routes/Admin/status");

const { scheduleAgeAndStatusUpdate } = require("./utils/ageIncrement");

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
app.use(settingsRoutes);
app.use(authRoutes);
app.use(registrationRoutes);

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the iSKed API");
});

/********* Website ******** */

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

// Function to increment birthdate and update status
scheduleAgeAndStatusUpdate();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
