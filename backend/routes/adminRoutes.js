// /backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Get all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  console.log('✅ Admin verified:', req.user); // Debug log

  try {
    const result = await pool.query(
      'SELECT id, username, gender, dob, phone, email FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
