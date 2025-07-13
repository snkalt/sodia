const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const crypto = require('crypto');

// Load env variables
require('dotenv').config();

// 📌 REGISTER
router.post('/signup', async (req, res) => {
  const { username, email, phone, password, dob, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, email, phone, password, dob, gender)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [username, email, phone, hashedPassword, dob, gender]
    );

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// 📌 LOGIN
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const userRes = await pool.query(
      `SELECT * FROM users WHERE email = $1 OR phone = $1`,
      [emailOrPhone]
    );

    if (userRes.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 📌 FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userRes = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
      [token, expiry, email]
    );

    // Simulate sending email
    console.log(`RESET LINK: http://localhost:3000/reset-password/${token}`);

    res.json({ message: 'Reset link sent to your email (check console)' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Error sending reset link' });
  }
});

// 📌 RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const userRes = await pool.query(
      `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()`,
      [token]
    );

    if (userRes.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2`,
      [hashed, userRes.rows[0].id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

module.exports = router;
