const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // PostgreSQL connection
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Existing login route
app.post('/login', async (req, res) => {
  // Your login logic here
});

// New user data fetching route
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return user information
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
