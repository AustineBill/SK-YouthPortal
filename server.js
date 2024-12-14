const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

require('dotenv').config();


const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(bodyParser.json());

/*const pool = new Pool({
  user: process.env.PG_USER,      // Get this from Render environment variables
  host: process.env.PG_HOST,      // Get this from Render environment variables
  database: process.env.PG_DB,    // Get this from Render environment variables
  password: process.env.PG_PASS,  // Get this from Render environment variables
  port: 5432,
});*/

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'iSKed',
    password: 'iSKedWB2024',
    port: 5432,
});


pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Connected to the database successfully.');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the iSKed API');
});

/********* Website ******** */

app.get('/Website/description', async (req, res) => {
    try {
        const result = await pool.query('SELECT description FROM Website WHERE id = $1', [1]);
        res.json(result.rows[0]); // Send the description
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching description' });
    }
});

app.put('/Website/description', async (req, res) => {
    const { description } = req.body;
    try {
        await pool.query('UPDATE Website SET description = $1 WHERE id = $2', [description, 1]);
        res.json({ message: 'Description updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating description' });
    }
});

app.get('/Website/mandate', async (req, res) => {
    try {
      const result = await pool.query('SELECT mandate, objectives, mission, vision FROM Website LIMIT 1');
      res.json(result.rows[0]); // Sends the data as JSON response
    } catch (error) {
      console.error('Error fetching mandate info:', error);
      res.status(500).json({ message: 'Error fetching mandate info' });
    }
  });

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query('INSERT INTO Users (username, password) VALUES ($1, $2)', [username, password]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err.stack);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    //console.log('Login attempt:', { username, password });
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
       //console.log('User ID from database:', user.id);

        // Validate password
        if (user.password !== password) { // Temporary for plain text; replace with bcrypt for hashing
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Return user details including ID
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                address: user.address,
                fullName: user.full_name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error('Login error:', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/Profile/:username', async (req, res) => {
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
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/reservations', async (req, res) => {
    const { user_id, reservation_type, start_date, end_date, time_slot } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO Schedules (user_id, reservation_type, start_date, end_date, time_slot)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, reservation_type, start_date, end_date, time_slot]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error saving reservation:', error);
      res.status(500).send('Server error');
    }
  });

app.get('/reservations', async (req, res) => {
    const { userId } = req.query; // Get userId from query parameters
  
    try {
      const result = await pool.query(
        `SELECT id, reservation_type AS program, start_date AS date, end_date, time_slot 
         FROM Schedules 
         WHERE user_id = $1
         ORDER BY start_date ASC`,
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).send('Server error');
    }
  });
  
app.post('/schedule/equipment', async (req, res) => {
  const { user_id, reservation_id, reservedEquipment, startDate, endDate } = req.body;
  //const pool = await pool.connect();  // Acquire pool from the pool
  try {
    await pool.query('BEGIN');  // Start the transaction

    // Step 1: Insert the reservation into the Equipment table
    const result = await pool.query(
      `INSERT INTO Equipment (user_id, reservation_id, start_date, end_date, reserved_equipment)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        user_id,
        reservation_id,
        startDate,
        endDate,
        JSON.stringify(reservedEquipment),
      ]
    );
    
    const reservationId = result.rows[0].id;

    // Step 2: Update inventory by reducing the quantity
    for (const equipment of reservedEquipment) {
      const { id, quantity } = equipment;

      // Check if there is enough stock
      const inventoryCheckQuery = 'SELECT quantity FROM Inventory WHERE id = $1';
      const inventoryCheckResult = await pool.query(inventoryCheckQuery, [id]);
      
      if (inventoryCheckResult.rowCount === 0 || inventoryCheckResult.rows[0].quantity < quantity) {
        // If not enough stock, rollback transaction and send error
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Not enough stock for ${equipment.name}` });
      }

      // Update the inventory by reducing the quantity
      const updateInventoryQuery = 'UPDATE Inventory SET quantity = quantity - $1 WHERE id = $2';
      await pool.query(updateInventoryQuery, [quantity, id]);
    }

    // Commit transaction after successful operations
    await pool.query('COMMIT');

    // Return the reservation details (with the inserted reservation ID)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');  // Rollback if an error occurs
    console.error('Error saving reservation:', error.message);  // Log the error message
    res.status(500).json({ error: error.message, stack: error.stack });
  } finally {
    pool.release();  // Release the database pool back to the pool
  }
});



app.get('/schedule/equipment', async (req, res) => {
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
      let equipmentInfo = "No Equipment Reserved";  // Default value for no equipment
      if (row.reserved_equipment) {
        try {
          // Handle cases where reserved_equipment is an array of arrays
          let reservedEquipment = row.reserved_equipment;
          // If it's an array of arrays, flatten it to a single array of objects
          if (Array.isArray(reservedEquipment) && reservedEquipment[0] && Array.isArray(reservedEquipment[0])) {
            reservedEquipment = reservedEquipment.flat();
          }
          // Ensure it's an array of objects before processing
          if (Array.isArray(reservedEquipment)) {
            // Format each equipment item as "name - quantity"
            equipmentInfo = reservedEquipment
              .map((item) => {
                if (item && typeof item === 'object') {
                  // If the item is an object, extract the name and quantity
                  const name = item.name || 'Unknown Item';
                  const quantity = item.quantity || 0;
                  return `${name} - ${quantity}`;
                }
                return 'Invalid equipment data';  // Handle invalid data
              })
              .join(", ");  // Join the items with a comma
          } else {
            equipmentInfo = "Invalid equipment data";  // Handle non-array data
          }
        } catch (error) {
          // Log any error that happens during JSON parsing
          console.error('Error processing reserved equipment:', error);
          equipmentInfo = "Error processing equipment details";  // Set error message for faulty data
        }
      }

      return {
        reservation_id: row.reservation_id,
        reserved_equipment: equipmentInfo,
        start_date: new Date(row.start_date).toLocaleString(),  // Ensure date formatting
        end_date: new Date(row.end_date).toLocaleString(),      // Ensure date formatting
      };
    });

    // If no equipment is reserved, return an empty array
    res.status(200).json(equipmentData.length > 0 ? equipmentData : []);
  } catch (error) {
    // Log any error that happens during the database query or data processing
    console.error('Error fetching equipment reservations:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/schedule/equipment', async (req, res) => {
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
      let equipmentInfo = "No Equipment Reserved";  // Default value for no equipment
      if (row.reserved_equipment) {
        try {
          // Handle cases where reserved_equipment is an array of arrays
          let reservedEquipment = row.reserved_equipment;
          // If it's an array of arrays, flatten it to a single array of objects
          if (Array.isArray(reservedEquipment) && reservedEquipment[0] && Array.isArray(reservedEquipment[0])) {
            reservedEquipment = reservedEquipment.flat();
          }
          // Ensure it's an array of objects before processing
          if (Array.isArray(reservedEquipment)) {
            // Format each equipment item as "name - quantity"
            equipmentInfo = reservedEquipment
              .map((item) => {
                if (item && typeof item === 'object') {
                  // If the item is an object, extract the name and quantity
                  const name = item.name || 'Unknown Item';
                  const quantity = item.quantity || 0;
                  return `${name} - ${quantity}`;
                }
                return 'Invalid equipment data';  // Handle invalid data
              })
              .join(", ");  // Join the items with a comma
          } else {
            equipmentInfo = "Invalid equipment data";  // Handle non-array data
          }
        } catch (error) {
          // Log any error that happens during JSON parsing
          console.error('Error processing reserved equipment:', error);
          equipmentInfo = "Error processing equipment details";  // Set error message for faulty data
        }
      }

      return {
        reservation_id: row.reservation_id,
        reserved_equipment: equipmentInfo,
        start_date: new Date(row.start_date).toLocaleString(),  // Ensure date formatting
        end_date: new Date(row.end_date).toLocaleString(),      // Ensure date formatting
      };
    });

    // If no equipment is reserved, return an empty array
    res.status(200).json(equipmentData.length > 0 ? equipmentData : []);
  } catch (error) {
    // Log any error that happens during the database query or data processing
    console.error('Error fetching equipment reservations:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/reservations/:reservationId', async (req, res) => {
    const { reservationId } = req.params;
    //console.log(`Fetching reservation details for ID: ${reservationId}`);

    try {
        const result = await pool.query('SELECT * FROM Schedules WHERE id = $1', [reservationId]); // Use pool.query()
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Send the reservation details back
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/equipment/:reservation_id', async (req, res) => {
  const { reservation_id } = req.params;
  //console.log(`Fetching reservation details for ID: ${reservationId}`);

  try {
    const result = await pool.query('SELECT * FROM Equipment WHERE reservation_id = $1', [reservation_id]);
      if (result.rows.length > 0) {
          res.json(result.rows[0]); // Send the reservation details back
      } else {
          res.status(404).json({ error: 'Reservation not found' });
      }
  } catch (error) {
      console.error('Error fetching reservation:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/reservations/:reservationId', async (req, res) => {
    const { reservationId } = req.params;
  
    try {
      // Delete the reservation using PostgreSQL query
      const result = await pool.query('DELETE FROM Schedules WHERE id = $1 RETURNING *', [reservationId]); // Use pool.query()
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json({ message: "Reservation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete('/equipment/:reservation_id', async (req, res) => {
  const { reservation_id } = req.params;

  try {
    // Step 1: Get the reservation details to identify the reserved equipment
    const reservationResult = await pool.query(
      'SELECT * FROM Equipment WHERE reservation_id = $1', 
      [reservation_id]
    );

    if (reservationResult.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Step 2: Get reserved equipment
    const reservedEquipment = reservationResult.rows[0].reserved_equipment;

    // Step 3: Check if reserved_equipment is a string and parse it if necessary
    let equipmentList;
    if (typeof reservedEquipment === 'string') {
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
        'UPDATE Inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *', 
        [quantity, id]
      );

      if (updateInventoryResult.rowCount === 0) {
        return res.status(404).json({ message: `Equipment with id ${id} not found in inventory` });
      }
    }

    // Step 5: Delete the reservation record
    const deleteReservationResult = await pool.query(
      'DELETE FROM Equipment WHERE reservation_id = $1 RETURNING *',
      [reservation_id]
    );

    if (deleteReservationResult.rowCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Step 6: Return success response
    res.status(200).json({ message: "Reservation cancelled and equipment quantity updated successfully" });

  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


/********* Auto Fill Details  *********/
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

app.get('/ViewSched', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.start_date, s.end_date, s.time_slot, u.username
            FROM Schedules s
            JOIN Users u ON s.user_id = u.id
            WHERE s.start_date >= CURRENT_DATE
            ORDER BY s.start_date ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/ViewEquipment', async (req, res) => {
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
      const formattedResult = result.rows.map(row => ({
          start_date: row.start_date,
          end_date: row.end_date,
          equipment_name: row.equipment.name,
          quantity: row.equipment.quantity
      }));

      res.json(formattedResult);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



/******** Inventory ********/

app.use('/public', express.static(path.join(__dirname, 'public')));

// Define multer storage configuration to save files in public/Asset
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public', 'Equipment');
    // Make sure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // All files will be saved to the public/Asset directory
  },
  filename: (req, file, cb) => {
    // Sanitize the filename to prevent issues with special characters
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, sanitizedFilename); // Keep the original file name
  },
}); 
// Initialize multer with the custom storage
const upload = multer({ storage: storage });

// POST route to add inventory item
app.post('/inventory', upload.single('image'), async (req, res) => {
  try {
    // Check if an image is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { name, quantity, specification, status } = req.body;
    const imageFileName = '/Equipment/' + req.file.filename; // Save only the relative path

    // Insert the item data into your database
    const query = 'INSERT INTO inventory (name, quantity, specification, status, image) VALUES ($1, $2, $3, $4, $5)';
    const values = [name, quantity, specification, status, imageFileName];

    await pool.query(query, values);

    res.status(201).send('Item added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// GET route to fetch all inventory items
app.get('/inventory', (req, res) => {
  pool.query('SELECT * FROM inventory')
    .then(result => res.json(result.rows))
    .catch(error => res.status(500).send(error.message));
});

// PUT route to update an inventory item
app.put('/inventory/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, specification, status } = req.body;
    let query = 'UPDATE inventory SET name = $1, quantity = $2, specification = $3, status = $4';
    const values = [name, quantity, specification, status];

    if (req.file) {
      const imageFileName = '/Equipment/' + req.file.filename;
      query += ', image = $5 WHERE id = $6';
      values.push(imageFileName, id);
    } else {
      query += ' WHERE id = $5';
      values.push(id);
    }

    await pool.query(query, values);
    res.status(200).send('Item updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE route to delete an inventory item
app.delete('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the item's image path to delete the file
    const result = await pool.query('SELECT image FROM inventory WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      const imagePath = path.join(__dirname, 'public', result.rows[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the item from the database
    await pool.query('DELETE FROM inventory WHERE id = $1', [id]);
    res.status(200).send('Item deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});



  /***** Check Reservatoion *******/


  app.post('/Checkreservation', async (req, res) => {
    const { user_id, date } = req.body;
  
    try {
      const query = 'SELECT * FROM Schedules WHERE user_id = $1 AND DATE(start_date) = $2';
      const values = [user_id, date];
      const result = await pool.query(query, values);
  
      res.json({ exists: result.rowCount > 0 });
    } catch (error) {
      console.error('Error checking reservation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/CheckEquipment', async (req, res) => {
    const { user_id, date } = req.body;
    try {
      const query = 'SELECT * FROM Equipment WHERE user_id = $1 AND DATE(start_date) = $2';
      const values = [user_id, date];
      const result = await pool.query(query, values);
      res.json({ exists: result.rowCount > 0 });
    } catch (error) {
      console.error('Error checking reservation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

//Admin Side
  /********* Contact Us na ito ******** */

  // Fetch contact details
app.get('/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT contact_number, location, gmail FROM public.contact WHERE id = $1', [1]);
    res.json(result.rows[0]); // Send the contact details
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({ error: 'Error fetching contact details' });
  }
});

// Update contact details
app.put('/contact', async (req, res) => {
  const { contact_number, location, gmail } = req.body;

  // Ensure all fields are provided
  if (!contact_number || !location || !gmail) {
    return res.status(400).json({ error: 'All fields (contact_number, location, gmail) are required' });
  }

  try {
    await pool.query('UPDATE public.contact SET contact_number = $1, location = $2, gmail = $3 WHERE id = $4',
      [contact_number, location, gmail, 1]);
    res.json({ message: 'Contact details updated successfully' });
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({ error: 'Error updating contact details' });
  }
});

//HOMEPAGE
// Fetch events from public.home
// Fetch events from the 'public.home' table
app.get('/events', async (req, res) => {
  try {
    // Query the database to get all events
    const result = await pool.query('SELECT event_name, event_description, amenities, event_image, event_image_format FROM public.home');
    
    // If there are events, send them as a JSON response
    if (result.rows.length > 0) {
      const events = result.rows.map(event => ({
        ...event,
        event_image: event.event_image ? `data:image/${event.event_image_format};base64,${event.event_image.toString('base64')}` : null,
      }));
      res.json(events);
    } else {
      res.status(404).json({ error: 'No events found' });
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});




// POST /events - Add new event
app.post('/events', async (req, res) => {
  const { event_name, event_description, amenities, event_image, event_image_format } = req.body;

  if (!event_name || !event_description || !amenities || !event_image || !event_image_format) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Step 1: Check if the event already exists
    const checkEventQuery = 'SELECT * FROM public.home WHERE event_name = $1';
    const checkEventResult = await pool.query(checkEventQuery, [event_name]);

    if (checkEventResult.rowCount > 0) {
      console.log(`Event with name "${event_name}" already exists.`);
      return res.status(400).json({ error: 'Event with this name already exists' });
    }

    // Step 2: Insert the new event into the database if it does not exist
    const insertQuery = `
      INSERT INTO public.home (event_name, event_description, amenities, event_image, event_image_format)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(insertQuery, [
      event_name,
      event_description,
      amenities,
      event_image,
      event_image_format,
    ]);

    // Log the inserted event
    const newEvent = result.rows[0];
    console.log('New event added:', newEvent);

    // Return the newly inserted event data
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Error adding event' });
  }
});


app.put('/events/:id', async (req, res) => {
    const { event_name, event_description, amenities, event_image, event_image_format } = req.body;
    const eventId = req.params.id;
  
    // Ensure required fields are provided
    if (!event_name || !event_description || !amenities) {
      return res.status(400).json({ error: 'All fields (event_name, event_description, amenities) are required' });
    }
  
    try {
      // Update event data in the database
      const result = await pool.query(
        'UPDATE public.home SET event_name = $1, event_description = $2, amenities = $3, event_image = $4, event_image_format = $5 WHERE id = $6',
        [event_name, event_description, amenities, event_image, event_image_format, eventId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      // Send a success response
      res.json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Error updating event details' });
    }
  });

  // DELETE /events/:id - Delete event by ID
  app.delete('/events/:event_name', async (req, res) => {
    const { event_name } = req.params;
  
    try {
      // Step 1: Fetch the event id based on the event name
      const getEventIdResult = await pool.query(
        'SELECT id FROM public.home WHERE event_name = $1',
        [event_name]
      );
  
      // Step 2: If no event is found, return an error
      if (getEventIdResult.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      const eventId = getEventIdResult.rows[0].id; // Fetch the event_id from the result
  
      // Step 3: Delete the event using the event_id
      const deleteResult = await pool.query(
        'DELETE FROM public.home WHERE id = $1 RETURNING *',
        [eventId]
      );
  
      // If no rows were affected, the event was not found
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      // Send back the deleted event data
      res.json({ message: 'Event deleted successfully', event: deleteResult.rows[0] });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});