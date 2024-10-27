const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection pool to PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'iSKed',
    password:  'JadeMalic143',  //'jadeskiii123',
    port: 5432,
});

// A simple root route
app.get('/', (req, res) => {
    res.send('Welcome to the iSKed API'); // A simple message
});

// API endpoint to handle user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Insert new user into the Admin table without hashing
        await pool.query('INSERT INTO "Users" (username, password) VALUES ($1, $2)', [username, password]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login attempt:', { username, password });

    try {
        const result = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                fullName: user.full_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/Profile/:username', async (req, res) => {
    const { username } = req.params;
    console.log('Profile request for username:', username); // Log the requested username

    try {
        const result = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        console.log('Database query result:', result.rows); // Log the result of the query

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// API endpoint to update user profile data
app.put('/Profile/:username', async (req, res) => {
    const { username } = req.params;
    const { fullName, email, phone, address } = req.body;

    try {
        await pool.query(
            'UPDATE "Users" SET full_name = $1, email = $2, phone = $3, address = $4 WHERE username = $5',
            [fullName, email, phone, address, username]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


