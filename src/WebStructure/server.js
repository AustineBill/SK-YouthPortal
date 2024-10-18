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
    password: 'jadeskiii123', //'JadeMalic143', 
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

// API endpoint to handle login
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

        // Compare the plain password with the one stored in the database
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


