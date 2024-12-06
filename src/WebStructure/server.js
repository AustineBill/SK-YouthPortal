const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  try {
      const result = await pool.query(
          'SELECT id, username, address, age, sex, contact_number, country FROM Users WHERE username = $1',
          [username]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(result.rows[0]);
  } catch (err) {
      console.error('Error fetching profile:', err.message);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Modify the '/Profile/:id' PUT route to update user data by id
app.put('/Profile/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, address } = req.body;
    try {
        // Update user data based on user id
        await pool.query(
            'UPDATE Users SET full_name = $1, email = $2, phone = $3, address = $4 WHERE id = $5',
            [fullName, email, phone, address, id]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Profile update error:', err.stack);
        res.status(500).json({ message: 'Server error' });
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
    try {
        const result = await pool.query(
            `INSERT INTO Equipment (user_id, reservation_id, start_date, end_date, reserved_equipment)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                user_id,
                reservation_id,
                startDate,
                endDate,
                JSON.stringify(reservedEquipment),
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error saving reservation:', error.message);  // Log the error message
        res.status(500).json({ error: error.message, stack: error.stack });  // Send the detailed error response
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

//********************* */
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


/******** Inventory ********/
app.get('/inventory', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM inventory');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  
  
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
