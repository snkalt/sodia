// models/postModel.js
const pool = require('../db');

const createPost = async (userId, content) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
    [userId, content]
  );
  return result.rows[0];
};

const getFollowedPosts = async (userId) => {
  const result = await pool.query(
    `
    SELECT posts.*, users.username FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE user_id IN (
      SELECT follows_id FROM followers WHERE user_id = $1
    )
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return result.rows;
};

const likePost = async (userId, postId) => {
  const result = await pool.query(
    `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [userId, postId]
  );
  return result.rows[0];
};

const replyToPost = async (userId, postId, content) => {
  const result = await pool.query(
    `INSERT INTO replies (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
    [userId, postId, content]
  );
  return result.rows[0];
};

module.exports = {
  createPost,
  getFollowedPosts,
  likePost,
  replyToPost,
};
