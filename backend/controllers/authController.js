const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmailOrPhone } = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { username, gender, dob, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      username,
      gender,
      dob,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username } });

  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error creating user' });
    }
  }
};

const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await findUserByEmailOrPhone(emailOrPhone);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
};

module.exports = { signup, login };
