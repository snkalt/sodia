const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Get all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, gender, dob, phone, email FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update a user
router.put('/users/:id', authenticate, adminOnly, async (req, res) => {
  const { username, gender, dob, phone, email } = req.body;
  try {
    await pool.query(
      `UPDATE users SET username = $1, gender = $2, dob = $3, phone = $4, email = $5 WHERE id = $6`,
      [username, gender, dob, phone, email, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
