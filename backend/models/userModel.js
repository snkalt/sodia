// models/userModel.js
const pool = require('../db');

const createUser = async ({ username, gender, dob, phone, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (username, gender, dob, phone, email, password)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [username, gender, dob, phone, email, password]
  );
  return result.rows[0];
};

const findUserByEmailOrPhone = async (emailOrPhone) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR phone = $1`,
    [emailOrPhone]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmailOrPhone,
};
