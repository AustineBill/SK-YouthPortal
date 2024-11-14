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

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query('INSERT INTO "Users" (username, password) VALUES ($1, $2)', [username, password]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err.stack);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });

    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        console.log('User ID from database:', user.id);
        // Validate password
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Return user details including ID
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,       // Add the id here
                username: user.username,
                address: user.address,
                fullName: user.full_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (err) {
        console.error('Login error:', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Modify the '/Profile/:id' route to fetch user data by id
app.get('/Profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Profile retrieval error:', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Modify the '/Profile/:id' PUT route to update user data by id
app.put('/Profile/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, address } = req.body;
    try {
        // Update user data based on user id
        await pool.query(
            'UPDATE "Users" SET full_name = $1, email = $2, phone = $3, address = $4 WHERE id = $5',
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

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
